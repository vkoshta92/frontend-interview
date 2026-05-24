// Command Pattern
// Behavioral
// Spin, Bet change, Auto-spin — sab commands hain. Undo/redo easy ho jaata hai!

// Simple matlab

// Command = action ko object mein wrap karo. Execute, undo, queue, log — sab possible!

// Command Interface
class Command {
  execute() { throw new Error('execute() implement!'); }
  undo()    { throw new Error('undo() implement!'); }
}

// Commands
class PlaceBetCommand extends Command {
  #wallet; #amount; #previousBet;

  constructor(wallet, amount) {
    super();
    this.#wallet = wallet;
    this.#amount = amount;
  }

  execute() {
    this.#previousBet = this.#wallet.bet;
    this.#wallet.bet = this.#amount;
    console.log(`Bet placed: $${this.#amount}`);
  }

  undo() {
    this.#wallet.bet = this.#previousBet;
    console.log(`Bet restored: $${this.#previousBet}`);
  }
}

class SpinCommand extends Command {
  #game; #result;

  constructor(game) {
    super();
    this.#game = game;
  }

  execute() {
    this.#result = this.#game.spin();
    return this.#result;
  }

  undo() {
    this.#game.reverseLastSpin(this.#result);
  }
}

// Command Invoker — history rakho
class CommandInvoker {
  #history = [];
  #redoStack = [];

  execute(command) {
    command.execute();
    this.#history.push(command);
    this.#redoStack = []; // Clear redo
  }

  undo() {
    const cmd = this.#history.pop();
    if (cmd) {
      cmd.undo();
      this.#redoStack.push(cmd);
    }
  }

  redo() {
    const cmd = this.#redoStack.pop();
    if (cmd) {
      cmd.execute();
      this.#history.push(cmd);
    }
  }
}

const invoker = new CommandInvoker();
invoker.execute(new PlaceBetCommand(wallet, 50));
invoker.execute(new SpinCommand(game));
invoker.undo(); // Last spin undo!
// gaming_company tip: Auto-spin feature mein commands queue hote hain — Command pattern perfect hai!