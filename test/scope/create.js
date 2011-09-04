require("../../src/scope.js");
require("../../src/scope/create.js");

describe('scope create', function () {

    it('should create an object with public properties/methods', function () {
        var mynamespace = scope.init()
        mynamespace.create('myclass', function () {
            //publics
            this.public.our_var = "i'm public";
            this.public.our_method = function (a, b) {
                return a + b;
            };
        });
    
        var myinstance = mynamespace.myclass();
        
        expect(typeof myinstance.our_var).toBe("string");
        expect(typeof myinstance.our_method).toBe("function");
        expect(myinstance.our_var).toBe("i'm public");
        expect(myinstance.our_method(3, 3)).toBe(6);
    });
    
    it('should create an object with private properties/methods', function () {
        var mynamespace = scope.init();
        mynamespace.create('myclass', function () {
            // privates
            this.private.my_var = "i'm private";
            this.private.my_method = function () {};
        });
    
        var myinstance = mynamespace.myclass();
    
        expect(typeof myinstance.my_var).toBeDefined();
        expect(typeof myinstance.my_method).toBeDefined();
    });
    
    it('should handle events', function () {
        var evt_fired = false;
        var mynamespace = scope.init();
   
        mynamespace.create('myclass', function () {
            // a function that fires an event
            this.public.my_method = function () {
                this.fire('my_event');
            };
        });
   
        var myinstance = mynamespace.myclass(); 
        myinstance.on('my_event', function () {
            evt_fired = true;
        });
        myinstance.my_method();

        expect(evt_fired).toBeTruthy();
    });

    it('should should call the constructor', function () {
        var constructor_called = false;
        var mynamespace = scope.init();
        mynamespace.create('myclass', function (    ) {
            
            this.init = function () {
                constructor_called = true;
            }
        });
    
        var myinstance = mynamespace.myclass();
        expect(constructor_called).toBeTruthy();
    });

    it('should should be able to access properties from constructor', function () {
        var constructor_called = false;
        var mynamespace = scope.init();
        mynamespace.create('myclass', function (any_param) {
            
            this.init = function () {
                expect(this.our_var).toBe("public property");
                expect(this.my_var).toBe("private property");
                expect(typeof this.my_method).toBe("function");
                expect(typeof this.our_method).toBe("function");
                constructor_called = true;
            }
             
            this.public.our_var = "public property";
            this.public.our_method = function () {};
            this.private.my_var = "private property";
            this.private.my_method = function () {};
        });
    
        var myinstance = mynamespace.myclass("cass");
        expect(constructor_called).toBeTruthy();
    });

    it('should should be able to call private properties or method from "this" inside public functions', function () {
            var mynamespace = scope.init();
            var reached = false;
            mynamespace.create('myclass', function (any_param) {
    
                this.private.my_var = "i'm private";
                this.private.my_method = function () {};        
                
                this.public.our_method = function () {
                    expect(this.my_var).toBe("i'm private");
                    expect(typeof this.my_method).toBe("function");
                    reached = true;
                };
            });
    
            var myinstance = mynamespace.myclass("cass");
            myinstance.our_method();
            expect(reached).toBeTruthy()
    });
    
    it('should should be able to call private properties or method from "this" inside private functions', function () {
            var mynamespace = scope.init();
            mynamespace.create('myclass', function (any_param) {
    
                this.public.our_var = "i'm public";
                this.public.our_method = function () {
                    this.my_method();
                };        
                
                this.private.my_method = function () {
                    expect(this.our_var).toBe("i'm public");
                    expect(typeof this.our_method).toBe("function");
                };
            });
    
            var myinstance = mynamespace.myclass("cass");
            myinstance.our_method();
        });

    it('should should be able to call properties or method from "this" inside functions', function () {
        var mynamespace = scope.init();
        mynamespace.create('myclass', function (any_param) {
           
            this.private.my_var = "i'm private";
            this.private.my_other_method = function () {};
            this.private.my_method = function () {
                expect(this.my_var).toBe("i'm private");
                expect(typeof this.my_other_method).toBe("function");
            };

            this.public.init = function () {
                this.my_method();
            };
        });

        var myinstance = mynamespace.myclass("class");
        myinstance.init();
    });
 
});