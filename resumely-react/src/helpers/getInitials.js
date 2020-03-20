export default (name = '') =>
 /* name
    .replace(/\s+/, ' ')
    .split(' ')
    .slice(0, 2)
    .map(v => v && v[0].toUpperCase())
    .join('');*/
    name.slice((name.lastIndexOf(".") - 1 >>> 0) + 2)
