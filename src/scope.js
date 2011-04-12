scope = {
    instances_objs: {},
    instances_stack: [],

    clear_instances: function () {
        scope.instances_objs = {};
        scope.instances_stack = [];
    },

    add_instance: function (name, instance) {
        if (typeof scope.instances_objs[name] === "object")
        throw new Error("Instance name already taken: " + name);

        scope.instances_objs[name] = instance;
        scope.instances_stack.push(instance);

        return instance;
    },

    get_instance: function (name) {
        var instance_provider = (typeof name === "string") ? 
        scope.instances_objs: scope.instances_stack;

        return instance_provider[name];
    },

    generate_instance_name: function (base_name) {
        var basename = base_name || "cjs";
        var _index = scope.instances_stack;
        var suffix = _index.length > 0 ? _index.length - 1: 0;
        var name = basename + suffix;

        while (typeof scope.instances_objs[name] === "object") {
            name = basename + (suffix++);
        }

        return name;
    },

    get_module: function (name, instance) {
        var func = scope[name];
        return function () {
            if (typeof func !== "function")
            throw new Error("Missing required module: " + name);

            var args = scope.util.from_args_to_array(arguments);

            return func.apply(instance, args);
        };
    },

    init: function (name) {
        var name = name || scope.generate_instance_name("cjs");
        var instance = {
            instance_name: name
        }

        //Adding modules
        instance.create = scope.get_module("create", instance);

        return scope.add_instance(name, instance);
    },

    util: {
        from_args_to_array: function (arguments_obj, array_to_push) {
            var args = array_to_push || [];
            for (var i = 0; i < arguments_obj.length; i++) {
                args.push(arguments_obj[i]);

            }
            return args;
        }
    }
};