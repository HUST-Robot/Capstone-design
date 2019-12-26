var recipe = {
  transcriptionHook: {
    "SHUTDOWN": {
      pattern: "shutdown yourself",
      command: "SHUTDOWN"
    }
  },
  command: {
    "SHUTDOWN": {
      shellExec: {
        exec: "sudo shutdown now"
      }
    }
  }
}

exports.recipe = recipe // Don't remove this line.
