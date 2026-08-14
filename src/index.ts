import { UIManager } from './ui/UIManager';

async function main() {
  const ui = new UIManager();
  await ui.start();
}

main().catch(err => console.error(err));
