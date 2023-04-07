'reach 0.1';

export const main = Reach.App(() => {
  const A = Participant('Alice', {
    params: Object({
      length: UInt,
      amount: UInt,
    }),
  });
  const B = Participant('Bob', {
    acceptTerms: Fun([], Bool),
  });
  const E = Events({
    payout: [UInt],
  });
  init();

  A.only(() => {
    const {length, amount} = declassify(interact.params);
  });
  A.publish(length, amount);
  commit();

  B.only(() => {
    const b = declassify(interact.acceptTerms());
  });
  B.publish(b)
    .pay(length * amount);


  var len = length;
  invariant(balance() == len * amount)
  while(len > 0){
    transfer(amount).to(A);
    E.payout(len);
    commit();
    A.publish();
    
    len = len - 1;
    continue;
  };
  commit();
  exit();
})
