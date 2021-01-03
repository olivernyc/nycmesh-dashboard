import _ from 'underscore';

// classNames("foo", {bar: true, baz: false}, "qux")
//   => "foo bar qux"
export function classNames(...args) {
  const classes = args.map(a => {
    if (_.isObject(a)) {
      return _.keys(_.pick(a, (v, k) => !!v));
    } else {
      return a;
    }
  }).flat();

  return classes.join(' ');
}
