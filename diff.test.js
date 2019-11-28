const diff = require("./diff.js");

describe("diff util spec", () => {
	it("should throw an error if both sources are not provided", () => {
		expect(() => diff()).toThrow();
	});

	it("should throw an error if one of the sources is not provided", () => {
		expect(() => diff({})).toThrow();
		expect(() => diff(null, {})).toThrow();
	});

	it("should throw an error if both sources are invalid", () => {
		expect(() => diff(1, "2")).toThrow();
		expect(() => diff(1, true)).toThrow();
		expect(() => diff(1, Symbol("a"))).toThrow();
		expect(() => diff(false, "lol")).toThrow();
	});

	it("should throw an error if one of the sources is invalid", () => {
		expect(() => diff({}, "2")).toThrow();
		expect(() => diff(1, {})).toThrow();
	});

	it("should throw an error if provided sources are not the same type", () => {
		expect(() => diff([], {})).toThrow();
		expect(() => diff({}, [])).toThrow();
	});

	it("should show diff for arrays", () => {
		const prev = [{ a: 12 }, { a: 13 }];
		const next = [{ a: 14 }, { a: 17 }];

		const expected = [
			{ path: "0.a", prev: 12, next: 14 },
			{ path: '1.a', prev: 13, next: 17 },
		];

		expect(diff(prev, next)).toEqual(expected);
	});

	it("should show diff for provided sources", () => {
		const prev = { a: 12 };
		const next = { a: 13 };

		const expected = [{ path: "a", prev: 12, next: 13 }];

		expect(diff(prev, next)).toEqual(expected);
	});

	it("should show deep diff for provided sources", () => {
		const prev = { a: 12, b: { s: { w: { q: "pabswq" } } } };
		const next = { a: 12, b: { s: { w: { q: "nabswq" } } } };

		const expected = [{ path: "b.s.w.q", prev: "pabswq", next: "nabswq" }];

		expect(diff(prev, next)).toEqual(expected);
	});

	it("should not show diff if no changes between sources", () => {
		const prev = { a: 12, b: { s: { w: { q: "pabswq" } } } };
		const next = { a: 12, b: { s: { w: { q: "pabswq" } } } };

		const expected = [];

		expect(diff(prev, next)).toEqual(expected);
	});

	it("should show diff for arrays", () => {
		const prev = {
			a: 12,
			b: { s: { w: { q: "pabswq", l: [1, 2, 3, 4] } } }
		};
		const next = {
			a: 12,
			b: { s: { w: { q: "pabswq", l: [1, 2, 3, 2] } } }
		};

		const expected = [{ path: "b.s.w.l.3", prev: 4, next: 2 }];

		expect(diff(prev, next)).toEqual(expected);
	});

	it("should transfomr result with provided transform function in options", () => {
		const prev = {
			a: 12,
			b: { s: { w: { q: "pabswq", l: [1, 2, 3, 4] } } }
		};
		const next = {
			a: 12,
			b: { s: { w: { q: "pabswq", l: [1, 2, 3, 2] } } }
		};

		const transform = data => ({ ...data, path: data.path.split(".") });

		const options = { transform };

		const expected = [
			{ path: ["b", "s", "w", "l", "3"], prev: 4, next: 2 }
		];

		expect(diff(prev, next, options)).toEqual(expected);
	});

	it("should show diff for functions", () => {
		const prev = {
			a: 12,
			b: { s: { w: { q: "pabswq", l: [1, 2, 3, 4] } } },
			l: () => {}
		};
		const next = {
			a: 12,
			b: { s: { w: { q: "pabswq", l: [1, 2, 3, 4] } } },
			l: () => {}
		};

		const expected = [{ path: "l", prev: prev.l, next: next.l }];

		expect(diff(prev, next)).toEqual(expected);
	});

	it("should show deep diff for multiple values", () => {
		const prev = {
			a: 12,
			b: { s: { w: { q: "pabswq", l: [1, 2, 3, 4] } } },
			l: () => {},
			q: {
				d: [
					{ a: 12, b: () => {} },
					{ b: { s: { w: { q: "pabswq", l: [1, 2, 3, 4] } } } },
					{
						b: {
							s: {
								w: {
									q: "pabswq",
									l: [1, 2, 3, 2],
									c: {
										lol: 12,
										f: {
											d: [
												{ a: 12, b: () => {} },
												{
													b: {
														s: {
															w: {
																q: "pabswq",
																l: [1, 2, 3, 4]
															}
														}
													}
												},
												{
													b: {
														s: {
															w: {
																q: "pabswq",
																l: [1, 2, 3, 2],
																c: { lol: 12 }
															}
														}
													}
												}
											]
										}
									}
								}
							}
						}
					}
				]
			}
		};
		const next = {
			a: 12,
			b: { s: { w: { q: "pabswq", l: [1, 2, 3, 4] } } },
			l: () => {},
			q: {
				d: [
					{ a: 12, b: () => {} },
					{ b: { s: { w: { q: "pabswq", l: [1, 2, 3, 2] } } } },
					{
						b: {
							s: {
								w: {
									q: "pabswq",
									l: [1, 2, 3, 3],
									c: {
										lol: 13,
										f: {
											d: [
												{ a: 12, b: () => {} },
												{
													b: {
														s: {
															w: {
																q: "pabswq",
																l: [1, 2, 3, 2]
															}
														}
													}
												},
												{
													b: {
														s: {
															w: {
																q: "pabswq",
																l: [1, 2, 3, 3],
																c: { lol: 13 }
															}
														}
													}
												}
											]
										}
									}
								}
							}
						}
					}
				]
			}
		};

		const expected = [
			{ path: "l", prev: prev.l, next: next.l },
			{ path: "q.d.0.b", prev: prev.q.d[0].b, next: next.q.d[0].b },
			{ path: "q.d.1.b.s.w.l.3", prev: 4, next: 2 },
			{ path: "q.d.2.b.s.w.l.3", prev: 2, next: 3 },
			{ path: "q.d.2.b.s.w.c.lol", prev: 12, next: 13 },
			{
				path: "q.d.2.b.s.w.c.f.d.0.b",
				prev: prev.q.d[2].b.s.w.c.f.d[0].b,
				next: next.q.d[2].b.s.w.c.f.d[0].b
			},
			{ path: "q.d.2.b.s.w.c.f.d.1.b.s.w.l.3", prev: 4, next: 2 },
			{ path: "q.d.2.b.s.w.c.f.d.2.b.s.w.l.3", prev: 2, next: 3 },
			{ path: "q.d.2.b.s.w.c.f.d.2.b.s.w.c.lol", prev: 12, next: 13 }
		];

		expect(diff(prev, next)).toEqual(expected);
	});

	it("should show as diff missing fieds", () => {
		const prev = {
			a: 12,
			b: {
				d: {
					q: 11,
					l: { d: 12 }
				},
				c: 12
			}
		};
		const next = {
			a: 12,
			b: {
				d: { q: 11 },
				c: 12,
				a: 13
			},
			f: { q: { w: 17 } }
		};

		const expected = [
			{ path: "b.d.l", prev: prev.b.d.l, next: undefined },
			{ path: "b.a", prev: undefined, next: 13 },
			{ path: "f", prev: undefined, next: next.f }
		];

		expect(diff(prev, next)).toEqual(expected);
	});
});
