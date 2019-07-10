export function resolveError() {
  return function (target, methodName, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
