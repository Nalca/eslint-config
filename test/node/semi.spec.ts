// Les types suivants sont juste présent afin que typescript ne hurle pas.
declare function describe(message: string, callback: () => void): void;
declare function it(message: string, callback: () => void): void;

interface Expectation {
  toBeTruthy: () => void;
}
declare function expect(value: any): Expectation;

describe("Module [utils.xmldoc]", () => {
  it("Work", () => {
    expect(true).toBeTruthy();
  });
});