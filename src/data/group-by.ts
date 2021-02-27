export type Group<T> = { key: string; items: T[] };

export default function groupBy<T, U extends Group<T>>(
    arr: T[],
    selector: (item: T) => string,
    construct: (k: string, t: T) => U
): U[];
export default function groupBy<T>(
    arr: T[],
    selector: (item: T) => string
): Group<T>[];
export default function groupBy<T, U extends Group<T>>(
    arr: T[],
    selector: (item: T) => string,
    construct?: (k: string, t: T) => U
) {
    const groups: any[] = [];

    for (const item of arr) {
        const key = selector(item);
        const group = findGroup(key);
        if (group) {
            group.items.push(item);
        } else if (construct) {
            groups.push(construct(key, item));
        } else {
            groups.push({
                key,
                items: [item],
            });
        }
    }

    return groups;

    function findGroup(key: string) {
        for (const group of groups) {
            if (group.key == key) {
                return group;
            }
        }
        return null;
    }
}
