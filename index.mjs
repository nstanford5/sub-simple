import { loadStdlib } from "@reach-sh/stdlib";
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib();

const sbal = stdlib.parseCurrency(100);

const [accA, accB] = await stdlib.newTestAccounts(2, sbal);
console.log('Gooood morning Alice and Bob');

console.log(`Launching backends...`);
const ctcA = accA.contract(backend);
const ctcB = accB.contract(backend, ctcA.getInfo());

ctcA.e.payout.monitor((evt) => {
  const {when, what: [period]} = evt;
  console.log(`We see that a payout was issued for period: ${period}`);
})

console.log(`Starting backend interactions`);
await Promise.all([
  backend.Alice(ctcA, {
    params: {
      length: 12,
      amount: stdlib.parseCurrency(1),
    },
  }),
  backend.Bob(ctcB, {
    acceptTerms: () => {
      return true;
    },
  }),
]);

console.log(`Goodbye, Alice and Bob`);
