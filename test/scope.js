require("../src/scope.js");

describe('scope framework handle', function () {
    it('should returns a new instance', function () {
        myfw = scope.init()
        expect(typeof myfw).toEqual("object");
    });

    it('should create a instance with name ', function () {
        myfw = scope.init("my_instance_name")
        expect(myfw.instance_name).toEqual("my_instance_name");
    });

    it('should create an instance with name even when no name were set', function () {
        myfw = scope.init();
        expect(myfw.instance_name).toContain("cjs");
    });

    it('should be able to find an instance by name', function () {
        myfw = scope.init('instance1');
        myfw2 = scope.init('instance2');

        get_myfw = scope.get_instance('instance1');
        expect(myfw).toEqual(get_myfw);
    });

    it('should be able to get an instance by index', function () {
        scope.clear_instances();

        myfw = scope.init('instance_X1');
        myfw2 = scope.init('instance_X2');

        get_myfw = scope.get_instance(0);
        expect(myfw).toEqual(get_myfw);

    });

    it('should get an error if instance name is already taken', function () {
        expect(function () {
            myfw = scope.init("1")
            myfw2 = scope.init("1")

        }).toThrow("Instance name already taken: 1");

    });

    it('should generate a friendly error when called dependencies are missing', function () {
        try {
            // mocking...
            var old_create = scope.create;
            scope.create = undefined;

            myfw = scope.init();
            myfw.create();
            expect("to reach this point").toBe(false);

        } catch(err) {
            expect("Missing required module: create").toEqual(err.message)

        } finally {
            // un-mocking.. 
            scope.create = old_create;

        }

    });

    it('should pass correct arguments to the required module', function () {
        myfw = scope.init("mock");

        // starting Mock
        scope.module_mock = function (a, b, c) {
            expect(10).toEqual(a);
            expect(20).toEqual(b);
            expect(30).toEqual(c);

        }
        myfw.module_mock = scope.get_module('module_mock');
        myfw.module_mock(10, 20, 30);
    });

    it('should apply framework instance to "this" on module class', function () {
        myfw = scope.init("testing_this");

        // starting Mock
        scope.module_mock = function () {
            expect(this.instance_name).toEqual("testing_this");
        }

        myfw.module_mock = scope.get_module('module_mock', myfw);
        myfw.module_mock();
    });


});