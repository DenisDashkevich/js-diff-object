# Js-diff
##### Js-diff is a small util to diff two sources.
###### Hi, you are welcome to contribute :)
### Usage:
###### For more usage examples, please visit: `diff.test.js` file.

- ##### Objects:
```js
const prev = { 
    a: 12, 
    s: { 
        w: 130, 
        q: { 
            e: { 
                s: { 
                    x: 'val',
                },
            },
        },
    },
    y: { 
        d: 14,
        x: [{ w: 150 }, { u: 149 }],
        e: { 
            c: 15,
        }
    },
};

const next = { 
    a: 13, 
    s: { 
        w: 130, 
        q: { 
            e: { 
                s: { 
                    x: 'changedVal',
                },
            },
        },
    },
    y: { 
        d: 15,
        x: [{ w: 150 }, { u: 145 }],
        e: { 
            c: 15,
        }
    },
};

const prevToNextDiff = diff(prev, next);
--->
[
    {path: "a", next: 13, prev: 12},
    {path: "s.q.e.s.x", next: "changedVal", prev: "val"},
    {path: "y.d", next: 15, prev: 14},
    {path: "y.x.1.u", next: 145, prev: 149}
]
```

- ##### Arrays:

```js

const prev = [{ a: 12 }, { a: 13 }];
const next = [{ a: 14 }, { a: 17 }];

const prevToNextDiff = diff(prevArr, nextArr);
--->
[
	{ path: "0.a", prev: 12, next: 14 },
	{ path: '1.a', prev: 13, next: 17 },
];

```

- ##### Missing Fields:

```js
const prev = {
	a: 12,
	b: { d: { q: 11, l: { d: 12 } }, c: 12 },
};
const next = {
	a: 12,
	b: { d: { q: 11 }, c: 12, a: 13 },
	f: { q: { w: 17 } },
};

const prevToNext = diff(prevWithMissingFields, nextWithMissingFields);
--->
[
	{ path: "b.d.l", prev: prev.b.d.l, next: undefined },
	{ path: "b.a", prev: undefined, next: 13 },
	{ path: "f", prev: undefined, next: next.f },
];
```

- ##### Options:
```js
const prev = {
	a: 12,
	b: { s: { w: { q: "pabswq", l: [1, 2, 3, 4] } } }
};
const next = {
	a: 12,
	b: { s: { w: { q: "pabswq", l: [1, 2, 3, 2] } } }
};

//diffChunk - { path: <String>, next: <any>, prev: <any> }
const transform = data => ({ ...data, path: data.path.split(".") });
const options = { transform };
		
const prevToNext = diff(prev, next, options);
--->
[
	{ path: ["b", "s", "w", "l", "3"], prev: 4, next: 2 }
];
```

### Options:
| Name         | Type         | Description |
|:-------------:|:-------------:|:------------:|
| equals      | Function | Function to compare provided values. Arguments: `prevVal: <any>`, `nextVal: <any>` Default: `(prevVal, nextVal) => prevVal === nextVal;`.
| transform | Function | Function to transform provided diff chunk. Will be called before actul push to result array. `NOTE: it should return value.` Arguments: `diffChunk - <{ path: <String>, next: <any>, prev: <any> }>` Default: `(diffChunk) => diffChunk`.

#### have a nice day :)
