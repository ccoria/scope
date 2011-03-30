framework = {
    instances: {},
    
    add_instance: function (name, instance) {
	    if (typeof framework.instances[name] === "object")
	        throw new Error("Instance name already taken: " + name);
	
		framework.instances[name] = instance;
		
		return instance;
    },

    get_instance: function (name) {
	    return framework.instances[name];
    },

    get_module: function (name) {
	    return function () {
	    	if (typeof framework[name] !== "function")
		        throw new Error("Missing required module: " + name);
	
		     return framework[name].apply(arguments)
	     };
    },

    init: function(name) {
        var name = name || "fw" + (new Date()).getTime();

        var instance = {
	        instance_name: name,
            create: framework.get_module("create"),
        }
        
        return framework.add_instance(name, instance);
    }
};