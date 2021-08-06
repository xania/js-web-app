using Api.WebData.Store.Records;
using System;
using System.Collections.Generic;
using System.Text;

namespace Api.WebData.Store.Entities
{
    public delegate U EntityFunc<T, U>(IEntity<T> entity);
    public delegate U EntityFunc<T, S, U>(IEntity<T> x, IEntity<S> y);

    // public delegate bool RecordFilter(ref byte record, int length);
    public interface IEntity<T>
    {
        Guid Id { get; }
        bool IsEmpty { get; }
        long Version { get; }
        T Content { get; }
        RecordHandle Handle { get; }

        ReadOnlySpan<byte> ContentSpan { get; }
        bool Contains(ref byte valueRef, int length);
        IEntity<U> Cast<U>();
    }

}
