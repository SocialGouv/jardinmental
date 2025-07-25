export function mergeClassNames(...classes: (string | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}