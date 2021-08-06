using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Text;

namespace Api.WebData.Store.Entities
{
    public unsafe class EntityHashSet
    {

        // lower 31 bits of hash code
        private const int Lower31BitMask = 0x7FFFFFFF;
        // cutoff point, above which we won't do stackallocs. This corresponds to 100 integers.
        // private const int StackAllocThreshold = 100;
        // when constructing a hashset from an existing collection, it may contain duplicates, 
        // so this is used as the max acceptable excess ratio of capacity to count. Note that
        // this is only used on the ctor and not to automatically shrink if the hashset has, e.g,
        // a lot of adds followed by removes. Users must explicitly shrink by calling TrimExcess.
        // This is set to 3 because capacity is acceptable as 2x rounded up to nearest prime.
        /// private const int ShrinkThreshold = 3;

        private int m_length;
        private int[] m_buckets;
        private Slot[] m_slots;
        private int m_count;
        private int m_lastIndex;


        #region Constructors

        /// <summary>
        /// Implementation Notes:
        /// Since resizes are relatively expensive (require rehashing), this attempts to minimize 
        /// the need to resize by setting the initial capacity based on size of collection. 
        /// </summary>
        /// <param name="collection"></param>
        /// <param name="comparer"></param>
        public EntityHashSet(int capacity)
        {
            m_lastIndex = 0;
            m_count = 0;

            int pow2 = 128;

            while (pow2 < capacity)
            {
                pow2 *= 2;
            }

            m_buckets = new int[pow2];
            m_slots = new Slot[pow2];
            m_length = pow2;
        }

        #endregion

        #region ICollection<T> methods

        /// <summary>
        /// Remove all items from this set. This clears the elements but not the underlying 
        /// buckets and slots array. Follow this call by TrimExcess to release these.
        /// </summary>
        public void Clear()
        {
            if (m_lastIndex > 0)
            {
                Debug.Assert(m_buckets != null, "m_buckets was null but m_lastIndex > 0");

                // clear the elements so that the gc can reclaim the references.
                // clear only up to m_lastIndex for m_slots 
                Array.Clear(m_slots, 0, m_lastIndex);
                Array.Clear(m_buckets, 0, m_length);
                m_lastIndex = 0;
                m_count = 0;
            }
        }

        /// <summary>
        /// Checks if this hashset contains the item
        /// </summary>
        /// <param name="item">item to check for containment</param>
        /// <returns>true if item contained; false if not</returns>
        public bool Contains(in Guid id)
        {
            int hashCode = InternalGetHashCode(id);
            // see note at "HashSet" level describing why "- 1" appears in for loop
            var bucket = hashCode & (m_length - 1);
            var i = m_buckets[bucket] - 1;
            while (i >= 0)
            {
                ref var slot = ref m_slots[i];
                if (slot.hashCode == hashCode && slot.value == id)
                    return true;
                i = slot.next;
            }
            // either m_buckets is null or wasn't found
            return false;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static bool Equals(byte* xp, byte* yp)
        {
            if (*(yp) != *(xp))
                return false;
            if (*(yp + 1) != *(xp + 1))
                return false;
            if (*(yp + 2) != *(xp + 2))
                return false;
            if (*(yp + 3) != *(xp + 3))
                return false;
            if (*(yp + 4) != *(xp + 4))
                return false;
            if (*(yp + 5) != *(xp + 5))
                return false;
            if (*(yp + 6) != *(xp + 6))
                return false;
            if (*(yp + 7) != *(xp + 7))
                return false;
            if (*(yp + 8) != *(xp + 8))
                return false;
            if (*(yp + 9) != *(xp + 9))
                return false;
            if (*(yp + 10) != *(xp + 1))
                return false;
            if (*(yp + 11) != *(xp + 11))
                return false;
            if (*(yp + 12) != *(xp + 12))
                return false;
            if (*(yp + 13) != *(xp + 13))
                return false;
            if (*(yp + 14) != *(xp + 14))
                return false;
            if (*(yp + 15) != *(xp + 15))
                return false;

            return true;
        }

        ///// <summary>
        ///// Remove item from this hashset
        ///// </summary>
        ///// <param name="item">item to remove</param>
        ///// <returns>true if removed; false if not (i.e. if the item wasn't in the HashSet)</returns>
        //public bool Remove(T item)
        //{
        //    if (m_buckets != null)
        //    {
        //        int hashCode = InternalGetHashCode(item);
        //        int bucket = hashCode % m_buckets.Length;
        //        int last = -1;
        //        for (int i = m_buckets[bucket] - 1; i >= 0; last = i, i = m_slots[i].next)
        //        {
        //            if (m_slots[i].hashCode == hashCode && m_comparer.Equals(m_slots[i].value, item))
        //            {
        //                if (last < 0)
        //                {
        //                    // first iteration; update buckets
        //                    m_buckets[bucket] = m_slots[i].next + 1;
        //                }
        //                else
        //                {
        //                    // subsequent iterations; update 'next' pointers
        //                    m_slots[last].next = m_slots[i].next;
        //                }
        //                m_slots[i].hashCode = -1;
        //                m_slots[i].value = default(T);
        //                m_slots[i].next = m_freeList;

        //                m_count--;
        //                m_version++;
        //                if (m_count == 0)
        //                {
        //                    m_lastIndex = 0;
        //                    m_freeList = -1;
        //                }
        //                else
        //                {
        //                    m_freeList = i;
        //                }
        //                return true;
        //            }
        //        }
        //    }
        //    // either m_buckets is null or wasn't found
        //    return false;
        //}

        /// <summary>
        /// Number of elements in this hashset
        /// </summary>
        public int Count => m_count;

        #endregion

        #region HashSet methods

        /// <summary>
        /// Searches the set for a given value and returns the equal value it finds, if any.
        /// </summary>
        /// <param name="equalValue">The value to search for.</param>
        /// <param name="actualValue">The value from the set that the search found, or the default value of <typeparamref name="T"/> when the search yielded no match.</param>
        /// <returns>A value indicating whether the search was successful.</returns>
        /// <remarks>
        /// This can be useful when you want to reuse a previously stored reference instead of 
        /// a newly constructed one (so that more sharing of references can occur) or to look up
        /// a value that has more complete data than the value you currently have, although their
        /// comparer functions indicate they are equal.
        /// </remarks>
        //public bool TryGetValue(in Record equalValue, out EntityID actualValue)
        //{
        //    if (m_buckets != null)
        //    {
        //        int i = InternalIndexOf(equalValue);
        //        if (i >= 0)
        //        {
        //            actualValue = m_slots[i].value;
        //            return true;
        //        }
        //    }
        //    actualValue = default;
        //    return false;
        //}

        #endregion

        #region Helper methods

        ///// <summary>
        ///// Initializes buckets and slots arrays. Uses suggested capacity by finding next prime
        ///// greater than or equal to capacity.
        ///// </summary>
        ///// <param name="capacity"></param>
        //private void Initialize(int capacity)
        //{
        //    Debug.Assert(m_buckets == null, "Initialize was called but m_buckets was non-null");

        //    m_buckets = new int[capacity];
        //    m_slots = new Slot[capacity];
        //}

        /// <summary>
        /// Expand to new capacity. New capacity is next prime greater than or equal to suggested 
        /// size. This is called when the underlying array is filled. This performs no 
        /// defragmentation, allowing faster execution; note that this is reasonable since 
        /// AddIfNotPresent attempts to insert new elements in re-opened spots.
        /// </summary>
        /// <param name="sizeSuggestion"></param>
        private void IncreaseCapacity()
        {
            Debug.Assert(m_buckets != null, "IncreaseCapacity called on a set with no elements");

            int newSize = m_count + 1024;

            // Able to increase capacity; copy elements to larger array and rehash
            SetCapacity(newSize);
        }

        /// <summary>
        /// Set the underlying buckets array to size newSize and rehash.  Note that newSize
        /// *must* be a prime.  It is very likely that you want to call IncreaseCapacity()
        /// instead of this method.
        /// </summary>
        private void SetCapacity(int newSize)
        {
            Slot[] newSlots = new Slot[newSize];
            if (m_slots != null)
            {
                Array.Copy(m_slots, 0, newSlots, 0, m_lastIndex);
            }

            int[] newBuckets = new int[newSize];
            for (int i = 0; i < m_lastIndex; i++)
            {
                int bucket = newSlots[i].hashCode % newSize;
                newSlots[i].next = newBuckets[bucket] - 1;
                newBuckets[bucket] = i + 1;
            }
            m_slots = newSlots;
            m_buckets = newBuckets;
            m_length = newSize;
        }

        /// <summary>
        /// Add item to this HashSet. Returns bool indicating whether item was added (won't be 
        /// added if already present)
        /// </summary>
        /// <param name="value"></param>
        /// <returns>true if added, false if already present</returns>
        public bool Add(Guid id)
        {
            int hashCode = InternalGetHashCode(id);
            int bucket = hashCode & (m_length - 1);
            var i = m_buckets[bucket] - 1;
            while (i >= 0)
            {
                ref var slot = ref m_slots[i];
                if (slot.hashCode == hashCode && slot.value == id)
                {
                    return false;
                }

                i = slot.next;
            }

            int index;
            if (m_lastIndex == m_length)
            {
                IncreaseCapacity();
                // this will change during resize
                bucket = hashCode & (m_length - 1);
            }
            index = m_lastIndex;
            m_lastIndex++;
            {
                ref var slot = ref m_slots[index];
                slot.hashCode = hashCode;
                slot.value = id;
                slot.next = m_buckets[bucket] - 1;
                m_buckets[bucket] = index + 1;
                m_count++;

                return true;
            }
        }

        /// <summary>
        /// Used internally by set operations which have to rely on bit array marking. This is like
        /// Contains but returns index in slots array. 
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        private int InternalIndexOf(Guid id)
        {
            Debug.Assert(m_buckets != null, "m_buckets was null; callers should check first");

            int hashCode = InternalGetHashCode(id);
            for (int i = m_buckets[hashCode % m_length] - 1; i >= 0; i = m_slots[i].next)
            {
                var slot = m_slots[i];
                if ((slot.hashCode) == hashCode)
                {
                    if (slot.value == id)
                        // if (Equals(m_slots[i].value, record.Pointer))
                        return i;
                }
            }
            // wasn't found
            return -1;
        }

        /// <summary>
        /// Workaround Comparers that throw ArgumentNullException for GetHashCode(null).
        /// </summary>
        /// <param name="item"></param>
        /// <returns>hash code</returns>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private static int InternalGetHashCode(in Guid id)
        {
            //result ^= Unsafe.Read<int>(record + 4);
            //result ^= Unsafe.Read<int>(record + 8);
            //result ^= Unsafe.Read<int>(record + 12);
            return Lower31BitMask & id.GetHashCode();
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private static int InternalGetHashCode(ref byte id)
        {
            //result ^= Unsafe.Read<int>(record + 4);
            //result ^= Unsafe.Read<int>(record + 8);
            //result ^= Unsafe.Read<int>(record + 12);
            return Lower31BitMask & Unsafe.ReadUnaligned<int>(ref id);
        }

        #endregion

        internal struct Slot
        {
            internal int hashCode;      // Lower 31 bits of hash code, -1 if unused
            internal int next;          // Index of next entry, -1 if last
            internal Guid value;
        }
    }
}
