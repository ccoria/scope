require("../app/framework.js");

describe('framework',
function() {
    it('should create new instance',
    function() {
        myfw = framework.init()
        expect(typeof myfw).toEqual("object");
    });

    it('should create a instance with name ',
    function() {
        myfw = framework.init("my_instance_name")
        expect(myfw.instance_name).toEqual("my_instance_name");
    });

    it('should create an instance with name even when no name were set',
    function() {
        myfw = framework.init();
        expect(myfw.instance_name).toContain("fw");
    });

    it('should be able to find an instance by name',
    function(){
        myfw = framework.init('instance1');
        myfw2 = framework.init('instance2');
        
        get_myfw = framework.get_instance('instance1');
        expect(myfw).toEqual(get_myfw);
    });

    it('should get an error if instance name is already taken',
    function() {
        expect(function() {
            myfw = framework.init("1")
            myfw2 = framework.init("1")
        }).toThrow("Instance name already taken: 1");
    });

    it('should generate a friendly error when called dependencies are missing',
    function() {
        try {
	 		myfw = framework.init();
            myfw.create();
            expect("To reach this point").toBe(false);
        } catch (err) {
	        expect("Missing required module: create").toEqual(err.message)
        }
    });
});