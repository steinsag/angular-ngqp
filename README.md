# Show problem of NGQP with initial values

This demonstrates an issue of [Angular ngqp](https://github.com/TNG/ngqp) plugin.

When `FilterList` component is shown, query parameter value of parameter `q` is not available and so the `combineLatest` operator doesn't fire.

The [suggested work-around](https://github.com/TNG/ngqp/issues/72#issuecomment-460008863) with wrapping `this.paramGroup.valueChanges` in another observable `this.paramGroupValues$` with a `startWith(this.paramGroup.value)` doesn't resolve the issue. It seems, `this.paramGroup.value` doesn't deliver a value when the component is loaded.
