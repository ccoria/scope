createjs = {
    instances: {},

    util: {
        from_args_to_array: function (arguments_obj, array_to_push) {
	        var args = array_to_push || [];
	        for (var i = 0; i < arguments_obj.length; i++) {
	            args.push(arguments_obj[i]);
	        }
	        return args;
        }	 
    },
    
    add_instance: function (name, instance) {
	    if (typeof createjs.instances[name] === "object")
	        throw new Error("Instance name already taken: " + name);
	
		createjs.instances[name] = instance;
		
		return instance;
    },

    get_instance: function (name) {
	    return createjs.instances[name];
    },

    generate_instance_name: function (base_name) {
	    var basename = base_name || "cjs";
	    var date = new Date();
	    /*var name = undefined;
	    var tries = 5;
	    console.log(basename);
	    var trying = setInterval(function () {
		    name = basename +  date.getTime() + date.getUTCMilliseconds();
		    console.log("++" + name);
		    if (typeof createjs.instances[name] === "object") {
			    tries--;
			} else {
				cearTimeout(trying);
				return name;
			}
	    }, 1);
	    
		//throw new Error("A new instance name could not be generated. Last try: " + name);*/
		return basename +  date.getTime() + date.getUTCMilliseconds();
    },

    get_module: function (name, instance) {
	    var func = createjs[name];
	    return function () {
	    	if (typeof func !== "function")
		        throw new Error("Missing required module: " + name);
	          
	         var args = createjs.util.from_args_to_array(arguments);
		     return func.apply(instance, args);
	     };
    },

    init: function(name) {
        var name = name || createjs.generate_instance_name("cjs");

        var instance = {
	        instance_name: name
        }
        
        //Adding modules
        instance.create = createjs.get_module("create", instance);
        
        return createjs.add_instance(name, instance);
    }
};