var recipe = {
  transcriptionHook: {
    "HIDE_ALL_MODULES": {
      pattern: "hide all",
      command: "HIDEMODULES"
    },
    "SHOW_ALL_MODULES": {
      pattern: "show all",
      command: "SHOWMODULES"
    },
  },
  command: {
    "HIDEMODULES": {
      moduleExec: {
        module:()=>{
          return []
        },
        exec: (module, params, key) => {
          module.hide(1000, null, {lockString:"AMK2"})
        }
      }
    },
    "SHOWMODULES": {
      moduleExec: {
        module:()=>{
          return []
        },
        exec: (module, params, key) => {
          module.show(1000, null, {lockString:"AMK2"})
        }
      }
    },
  },
}

exports.recipe = recipe
