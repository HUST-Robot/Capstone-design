var recipe = {
  transcriptionHook: {
    "REBOOT": {
      pattern: "reboot yourself",
      command: "REBOOT"
    },
  },
  command: {
    "REBOOT": {
      shellExec: {
        exec: "sudo reboot now"
      }
    }
  }
}

exports.recipe = recipe // Don't remove this line.
