async function getCommands() {
  const script = "this.commands.filter(command => command.name !== 'eval')";
  +'.map(c => c);';
  return await ApiWorker.manager.shards.first().eval(script);
}

module.exports = getCommands;
