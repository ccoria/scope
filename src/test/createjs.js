require("../app/createjs.js");

describe('createjs framework handle',
function() {
    it('should returns a new instance',
    function () {
        myfw = createjs.init()
        expect(typeof myfw).toEqual("object");
    });

    it('should create a instance with name ',
    function() {
        myfw = createjs.init("my_instance_name")
        expect(myfw.instance_name).toEqual("my_instance_name");
    });

    it('should create an instance with name even when no name were set',
    function() {
        myfw = createjs.init();
        expect(myfw.instance_name).toContain("cjs");
    });

    it('should be able to find an instance by name',
    function(){
        myfw = createjs.init('instance1');
        myfw2 = createjs.init('instance2');
        
        get_myfw = createjs.get_instance('instance1');
        expect(myfw).toEqual(get_myfw);
    });

    it('should get an error if instance name is already taken',
    function() {
        expect(function() {
            myfw = createjs.init("1")
            myfw2 = createjs.init("1")
        }).toThrow("Instance name already taken: 1");
    });

    it('should generate a friendly error when called dependencies are missing',
    function() {
        try {
	 		myfw = createjs.init();
            myfw.create();
            expect(" to reach this point").toBe(false);
        } catch (err) {
	        expect("Missing required module: create").toEqual(err.message)
        }
    });

	it('should pass correct arguments to the required module',
    function() {
	    myfw = createjs.init("mock");
	    
	    // starting Mock
	    createjs.module_mock = function(a, b, c) {
		    expect(10).toEqual(a);
		    expect(20).toEqual(b);
		    expect(30).toEqual(c);
	    }
	    myfw.module_mock = createjs.get_module('module_mock');        
        myfw.module_mock(10, 20, 30);
        //expect(createjs.module_mock).toHaveBeenCalledWith([10,20,30]);
    });
});