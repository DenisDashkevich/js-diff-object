
### Usage:

```js
//Object:
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

//Arrays:
const prevArr = [{ a: 12 }, { a: 13 }];
const nextArr = [{ a: 14 }, { a: 17 }];

const prevArrToNextArrDiff = diff(prevArr, nextArr);
--->
[
	{ path: "0.a", prev: 12, next: 14 },
	{ path: '1.a', prev: 13, next: 17 },
];

//Missing fields:
const prevWithMissingFields = {
	a: 12,
	b: {
		d: {
		    q: 11,
			l: { d: 12 }
		},
	    c: 12,
	},
};
const nextWithMissingFields = {
	a: 12,
	b: {
		d: { q: 11 },
		c: 12,
		a: 13
	},
	f: { 
	    q: { 
	        w: 17,
	   },
	},
};

const prevWithMissingFieldsTonextWithMissingFields = diff(prevWithMissingFields, nextWithMissingFields);
--->
[
	{ path: "b.d.l", prev: prev.b.d.l, next: undefined },
	{ path: "b.a", prev: undefined, next: 13 },
	{ path: "f", prev: undefined, next: next.f },
];
```
