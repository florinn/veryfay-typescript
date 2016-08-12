/// <reference path='../setup.ts' /> 

module VeryfayTests {

    describe("veryfay", () => {

        let ae: Veryfay.AuthorizationEngine;

        beforeEach(() => {
            ae = new veryfay.AuthorizationEngine()
                .register(new veryfay.CRUDP(veryfay.Nothing)).allow(Admin.instance).deny(Supervisor.instance, Commiter.instance).deny(Contributor.instance).and
                .register(new veryfay.CRUDP(SomeOtherClass)).allow(Admin.instance).allow(Supervisor.instance).allow(Reader.instance).allow(Contributor.instance).and
                .register(new veryfay.Create(veryfay.Nothing)).allow(Commiter.instance).deny(Contributor.instance).and
                .register(new veryfay.Read(veryfay.Nothing)).allow(Commiter.instance).deny(Contributor.instance).allow(Reviewer.instance).and
                .register(new veryfay.Read(SomeClass)).allow(Supervisor.instance, Commiter.instance).and
                .register(new veryfay.Read(SomeClass), new veryfay.Read(SomeOtherClass)).allow(Supervisor.instance).allow(Contributor.instance).deny(Reader.instance).and
                .register(new veryfay.Read(SomeClass)).allow(Reader.instance).and
                .register(new veryfay.Read(OtherSomeOtherClass)).allow(Reader.instance).deny(Commiter.instance).allow(Reviewer.instance).and;
        });

        describe("when action target not found", () => {

            it("should fail", () => {
                let result = ae.get(new veryfay.Create(SomeClass)).isAllowing(new PrincipalClass("commiter"));
                expect(() => ae.get(new veryfay.Create(SomeClass)).verify(new PrincipalClass("commiter"))).to.throw(veryfay.AuthorizationException);
                expect(result.isFailure).to.be.true;
            });

        });

        describe("when action target found", () => {

            it("should fail when target type not matching", () => {
                let result = ae.get(new veryfay.Read(OtherSomeOtherClass)).isAllowing(new PrincipalClass("supervisor"));
                expect(() => ae.get(new veryfay.Read(OtherSomeOtherClass)).verify(new PrincipalClass("supervisor"))).to.throw(veryfay.AuthorizationException);
                expect(result.isFailure).to.be.true;
            });

            describe("when deny role found", () => {

                describe("once", () => {

                    it("should fail when principal match the deny role definition", () => {
                        let result = ae.get(new veryfay.Read(veryfay.Nothing)).isAllowing(new OtherPrincipalClass("contributor"));
                        expect(() => ae.get(new veryfay.Read(veryfay.Nothing)).verify(new OtherPrincipalClass("contributor"))).to.throw(veryfay.AuthorizationException);
                        expect(result.isFailure).to.be.true;
                    });
                    it("should fail when principal and extra info match the deny role definition", () => {
                        let result = ae.get(new veryfay.Read(SomeClass)).isAllowing(new PrincipalClass("reader"), 1234);
                        expect(() => ae.get(new veryfay.Read(SomeClass)).verify(new PrincipalClass("rader"), 1234)).to.throw(veryfay.AuthorizationException);
                        expect(result.isFailure).to.be.true;
                    });
                    it("should succeed when principal does not match every deny role definition in a set", () => {
                        let result = ae.get(new veryfay.Create(veryfay.Nothing)).isAllowing(new PrincipalClass("commiter"));
                        ae.get(new veryfay.Create(veryfay.Nothing)).verify(new PrincipalClass("commiter"));
                        expect(result.isSuccess).to.be.true;
                    });
                    it("should fail when principal match every deny role definition in a set", () => {
                        let result = ae.get(new veryfay.Create(veryfay.Nothing)).isAllowing(new PrincipalClass("supervisor-commiter"));
                        expect(() => ae.get(new veryfay.Create(veryfay.Nothing)).verify(new PrincipalClass("supervisor-commiter"))).to.throw(veryfay.AuthorizationException);
                        expect(result.isFailure).to.be.true;
                    });
                    it("should fail when principal and extra info match the type of the deny role defintion", () => {
                        let result = ae.get(new veryfay.Read(SomeOtherClass)).isAllowing(new OtherPrincipalClass("reader"), [1234, "1234"]);
                        expect(() => ae.get(new veryfay.Read(SomeOtherClass)).verify(new OtherPrincipalClass("reader"), [1234, "1234"])).to.throw(veryfay.AuthorizationException);
                        expect(result.isFailure).to.be.true;
                    });
                    it("should succeed when principal type does not match the type of the deny role definition", () => {
                        let result = ae.get(new veryfay.Read(veryfay.Nothing)).isAllowing(new PrincipalClass("contributor"));
                        ae.get(new veryfay.Read(veryfay.Nothing)).verify(new PrincipalClass("contributor"));
                        expect(result.isSuccess).to.be.true;
                    });
                    it("should succeed when extra info type does not match the type of the deny role definition", () => {
                        let result = ae.get(new veryfay.Read(OtherSomeOtherClass)).isAllowing(new PrincipalClass("commiter"), 1234);
                        ae.get(new veryfay.Read(OtherSomeOtherClass)).verify(new PrincipalClass("commiter"), 1234);
                        expect(result.isSuccess).to.be.true;
                    });

                });

                describe("more than once", () => {

                    it("should fail when principal and extra info match any deny role definition", () => {
                        let result = ae.get(new veryfay.Read(veryfay.Nothing)).isAllowing(new OtherPrincipalClass("contributor"));
                        expect(() => ae.get(new veryfay.Read(veryfay.Nothing)).verify(new OtherPrincipalClass("contributor"))).to.throw(veryfay.AuthorizationException);
                        expect(result.isFailure).to.be.true;
                    });
                    it("should fail when principal and extra info match any contained deny role definition", () => {
                        let result = ae.get(new veryfay.Patch(veryfay.Nothing)).isAllowing(new OtherPrincipalClass("contributor"));
                        expect(() => ae.get(new veryfay.Patch(veryfay.Nothing)).verify(new OtherPrincipalClass("contributor"))).to.throw(veryfay.AuthorizationException);
                        expect(result.isFailure).to.be.true;
                    });
                    it("should fail when principal and extra info match any deny role definition in an embedded container action", () => {
                        let result = ae.get(new veryfay.Delete(veryfay.Nothing)).isAllowing(new OtherPrincipalClass("contributor"));
                        expect(() => ae.get(new veryfay.Delete(veryfay.Nothing)).verify(new OtherPrincipalClass("contributor"))).to.throw(veryfay.AuthorizationException);
                        expect(result.isFailure).to.be.true;
                    });

                });

            });

            describe("when deny role not found", () => {

                describe("when allow role not found", () => {

                    it("should fail", () => {
                        let result = ae.get(new veryfay.Read(SomeClass)).isAllowing(new PrincipalClass("laura"));
                        expect(() => ae.get(new veryfay.Read(SomeClass)).verify(new PrincipalClass("laura"))).to.throw(veryfay.AuthorizationException);
                        expect(result.isFailure).to.be.true;
                    });

                });

                describe("when allow role found", () => {

                    describe("once", () => {

                        it("should succeed when principal match the allow role definition", () => {
                            let result = ae.get(new veryfay.Read(SomeOtherClass)).isAllowing(new OtherPrincipalClass("contributor"));
                            ae.get(new veryfay.Read(SomeOtherClass)).verify(new OtherPrincipalClass("contributor"));
                            expect(result.isSuccess).to.be.true;
                        });
                        it("should succeed when principal and extra info match an allow role definition", () => {
                            let result = ae.get(new veryfay.Read(OtherSomeOtherClass)).isAllowing(new OtherPrincipalClass("reader"), [1234, "1234"]);
                            ae.get(new veryfay.Read(OtherSomeOtherClass)).verify(new OtherPrincipalClass("reader"), [1234, "1234"]);
                            expect(result.isSuccess).to.be.true;
                        });
                        it("should fail when principal does not match every allow role definition in a set", () => {
                            let result = ae.get(new veryfay.Read(SomeClass)).isAllowing(new PrincipalClass("commiter"));
                            expect(() => ae.get(new veryfay.Read(SomeClass)).verify(new PrincipalClass("commiter"))).to.throw(veryfay.AuthorizationException);
                            expect(result.isFailure).to.be.true;
                        });
                        it("should succeed when principal does match every allow role definition in a set", () => {
                            let result = ae.get(new veryfay.Read(SomeClass)).isAllowing(new PrincipalClass("supervisor-commiter"));
                            ae.get(new veryfay.Read(SomeClass)).verify(new PrincipalClass("supervisor-commiter"));
                            expect(result.isSuccess).to.be.true;
                        });
                        it("should succeed when principal and extra info match the type of the allow role definition", () => {
                            let result = ae.get(new veryfay.Read(OtherSomeOtherClass)).isAllowing(new OtherPrincipalClass("reader"), [1234, "1234"]);
                            ae.get(new veryfay.Read(OtherSomeOtherClass)).verify(new OtherPrincipalClass("reader"), [1234, "1234"]);
                            expect(result.isSuccess).to.be.true;
                        });
                        it("should fail when principal type does not match the type of the allow role definition", () => {
                            let result = ae.get(new veryfay.Read(SomeOtherClass)).isAllowing(new PrincipalClass("reader"), [1234, "1234"]);
                            expect(() => ae.get(new veryfay.Read(SomeOtherClass)).verify(new PrincipalClass("reader"), [1234, "1234"])).to.throw(veryfay.AuthorizationException);
                            expect(result.isFailure).to.be.true;
                        });
                        it("should fail when extra info type does not match the type of the allow role definition", () => {
                            let result = ae.get(new veryfay.Read(SomeOtherClass)).isAllowing(new OtherPrincipalClass("reader"), 1234);
                            expect(() => ae.get(new veryfay.Read(SomeOtherClass)).verify(new OtherPrincipalClass("reader"), 1234)).to.throw(veryfay.AuthorizationException);
                            expect(result.isFailure).to.be.true;
                        });

                    });

                    describe("more than once", () => {

                        it("should succeed when principal and extra info match any allow role definition", () => {
                            let result = ae.get(new veryfay.Read(SomeClass)).isAllowing(new PrincipalClass("supervisor"));
                            ae.get(new veryfay.Read(SomeClass)).verify(new PrincipalClass("supervisor"));
                            expect(result.isSuccess).to.be.true;
                        });
                        it("should fail when principal and extra info do not match the param types of any allow role definition", () => {
                            let result = ae.get(new veryfay.Read(SomeClass)).isAllowing(new OtherPrincipalClass("supervisor"));
                            expect(() => ae.get(new veryfay.Read(SomeClass)).verify(new OtherPrincipalClass("reader"), 1234)).to.throw(veryfay.AuthorizationException);
                            expect(result.isFailure).to.be.true;
                        });
                        it("should succeed when principal and extra info match any contained allow role definition", () => {
                            let result = ae.get(new veryfay.Patch(SomeOtherClass)).isAllowing(new PrincipalClass("admin"));
                            ae.get(new veryfay.Patch(SomeOtherClass)).verify(new PrincipalClass("admin"));
                            expect(result.isSuccess).to.be.true;
                        });
                        it("should succeed when principal and any extra info match any allow role definition in an embedded container action", () => {
                            let result = ae.get(new veryfay.Delete(SomeOtherClass)).isAllowing(new PrincipalClass("admin"));
                            ae.get(new veryfay.Delete(SomeOtherClass)).verify(new PrincipalClass("admin"));
                            expect(result.isSuccess).to.be.true;
                        });

                    });

                });

            });

        });

    });
}