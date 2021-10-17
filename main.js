// let main = document.querySelector("main").children;
// let arr = [...main];
// arr.forEach(element =>element.style.display = "none");

// Negatives to 0
Math.positive = function (num) {
  return num < 0 ? 0 : num;
};

// Secured Math.Random
let randomNumber = (min, max) => {
  const randomBuffer = new Uint32Array(1);

  window.crypto.getRandomValues(randomBuffer);

  let randomNumber = randomBuffer[0] / (0xffffffff + 1);

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(randomNumber * (max - min + 1)) + min;
};


let fullPercent = () => randomNumber(0, 100); //0% - 100%

//Stats Basis
let hml = {
  high: [75, 100],
  med: [50, 75],
  low: [25, 50],
};

//Max Stats Basis
let maxStats = {
  maxHealth: 10000,
  maxDefense: 5000,
  maxAttack: 1000,
};

class Battle {
  constructor(h, d, a) {
    this.baseHealth = Math.floor((randomNumber(...hml[h]) / 100) * maxStats['maxHealth']);
    this.baseDefense = Math.floor((randomNumber(...hml[d]) / 100) * maxStats['maxDefense']);
    this.baseAttack = Math.floor((randomNumber(...hml[a]) / 100) * maxStats['maxAttack']);
    this.health = this.baseHealth;
    this.defense = this.baseDefense;
    this.attack = this.baseAttack;
    this.damage = this.attack;
  }
}

class Tank extends Battle {
  name = "Tank";
  constructor() {
    super("high", "high", "low");
  }
  damage = this.attack;

  //Iron Fist
  passive = () => {
    if (fullPercent() <= 10) return true;
    return false;
  };

  roundDefense = () => (randomNumber(0, 25) / 100) * this.defense;

  //Heal
  ability1 = (opponentDamage) => {
    this.damage = this.attack; //Resets Damage
    //Passive Prob.
    let p = this.passive(opponentDamage);
    //Passive Additional Damage
    let padd = 0.2 * this.health;
    if (p) this.damage += padd;
    let d = this.roundDefense();
    opponentDamage -= d;
    this.defense -= d;
    opponentDamage = Math.positive(opponentDamage);


    let heal = (randomNumber(10, 20) / 100) * this.baseHealth;
    opponentDamage -= heal;
    this.health -= opponentDamage;
    return {
      passiveChance: Math.floor(p),
      passiveDamage: padd,
      defenseRound: Math.floor(d),
      netOpponentDamage: Math.floor(opponentDamage),
      netHeal: Math.floor(heal),
    };
  };
  //Sacrifice
  ability2 = (opponentDamage) => {
    this.damage = this.attack; //Resets Damage
    //Passive Prob.
    let p = this.passive(opponentDamage);
    //Passive Additional Damage
    let padd = 0.2 * this.health;
    let d = this.roundDefense();
    if (p) this.damage += padd;
    opponentDamage -= d;
    this.defense -= d;
    opponentDamage = Math.positive(opponentDamage);
   
    
    let sacAdd = 0;
    let sacChance = false;
    let sacLess = padd;
    opponentDamage += 0.2 * this.health;
    if (fullPercent() <= 40) {
        sacAdd = opponentDamage;
        this.damage += sacAdd;
        sacChance = true;
    }
    this.health -= opponentDamage;
    return {
      passiveChance: Math.floor(p),
      passiveDamage: padd,
      defenseRound: Math.floor(d),
      netOpponentDamage: Math.floor(opponentDamage),
      sacrificeAdd: Math.floor(sacAdd),
      sacrificeChance: sacChance,
      sacrificeLess: Math.floor(sacLess),
    };
  };

  //Double Chance
  ability3 = (opponentDamage) => {
    this.damage = this.attack; //Resets Damage
    //Passive Prob.
    let p = this.passive(opponentDamage);
    //Passive Additional Damage
    let padd = 0.2 * this.health;
    if (p) this.damage += padd;
    let d = this.roundDefense();
    opponentDamage -= d;
    this.defense -= d;
    opponentDamage = Math.positive(opponentDamage);

    let dcAL = 0.1 * this.baseHealth;
    let dcChance = false;
    opponentDamage += 0.1 * dcAL;
    this.damage += 0.1 * dcAL;
    if (fullPercent() <= 50) dcChance = true;
    this.health -= opponentDamage;
    return {
      passiveChance: Math.floor(p),
      passiveDamage: padd,
      defenseRound: Math.floor(d),
      netOpponentDamage: Math.floor(opponentDamage),
      doubleChanceAdd: Math.floor(dcAL),
      doubleChance: dcChance,
      doubleChanceLess: Math.floor(dcAL),
    };
  };
}



let commentator = (sample) => {
  console.log(sample.name);
  console.log(sample.health);
  console.log(sample.defense);
  console.log(sample.attack);
};

let ngina = new Tank();
commentator(ngina);
let umay = new Tank();
commentator(umay);

let loop = () => {
  let round = 0,
    oppDam = umay.damage;
  while (round != 20 && ngina.health > 0 && umay.health > 0) {
    round++;
    console.log("\n\nROUND " + round);
    console.log("\nPlayer 1 : " + oppDam);
    oppDam = ngina.ability3(umay.damage).netOpponentDamage;
    commentator(ngina);
    if(ngina.health <= 0){
        console.log("Player 2 win!\n");
        break;
    }
    console.log("\nPlayer 2 : " + oppDam);
    oppDam = umay.ability3(ngina.damage).netOpponentDamage;
    commentator(umay);
    if(ngina.health <= 0) console.log("Player 1 win!\n");

}
};
loop();
