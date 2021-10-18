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
  maxDefense: 2000,
  maxAttack: 1000,
};

class Battle {
  constructor(h, d, a) {
    this.baseHealth = Math.floor(
      (randomNumber(...hml[h]) / 100) * maxStats["maxHealth"]
    );
    this.baseDefense = Math.floor(
      (randomNumber(...hml[d]) / 100) * maxStats["maxDefense"]
    );
    this.baseAttack = Math.floor(
      (randomNumber(...hml[a]) / 100) * maxStats["maxAttack"]
    );
    this.health = this.baseHealth;
    this.defense = this.baseDefense;
    this.attack = this.baseAttack;
    this.damage = this.attack;
  }
  roundDefense = () => (randomNumber(1, 25) / 100) * this.baseDefense;
  defRound = (opponentDamage, d) => {
    if (d >= this.defense) d = this.defense;
    if (opponentDamage <= d) d = opponentDamage;
    opponentDamage -= d;
    this.defense -= d;
    return Math.positive(opponentDamage);
  };
}

class Tank extends Battle {
  name = "Tank";
  constructor() {
    super("high", "high", "low");
  }
  damage = this.attack;
  dcChance = false;
  
  //Details
  class = "Tank";
  passive = "Iron Fist";
  ability1 = "Heal";
  ability2 = "Sacrifice";
  ability3 = "Double Chance";

  //Iron Fist
  passive = () => {
    if (fullPercent() <= 10) return true;
    return false;
  };

  //Heal
  ability1 = (opponentDamage) => {
    //Ability 3 Double Chance Fix
    if (this.dcChance) this.damage += this.attack;
    else this.damage = this.attack; //Resets Damage
    this.dcChance = false;

    //Passive Process
    let p = this.passive(opponentDamage);
    //Passive Additional Damage
    let padd = 0.2 * this.health;
    if (p) this.damage += padd;

    //Ability Process
    let heal = (randomNumber(1, 10) / 100) * this.health;
    opponentDamage -= heal;
    opponentDamage = Math.positive(opponentDamage);

    //Defense Process
    let d = this.roundDefense();
    opponentDamage = this.defRound(opponentDamage, d);

    //Final Take
    this.health -= opponentDamage;
    if (this.health <= 0) this.health = 0;
    return {
      health: this.health,
      defense: this.defense,
      damage: this.damage,
      passiveChance: Math.floor(p),
      passiveDamage: padd,
      defenseRound: Math.floor(d),
      netOpponentDamage: Math.floor(opponentDamage),
      netHeal: Math.floor(heal),
    };
  };

  //Sacrifice
  ability2 = (opponentDamage) => {
    //Ability 3 Double Chance Fix
    if (this.dcChance) this.damage += this.attack;
    else this.damage = this.attack; //Resets Damage
    this.dcChance = false;

    //Passive Process.
    let p = this.passive(opponentDamage);
    //Passive Additional Damage
    let padd = 0.2 * this.health;
    if (p) this.damage += padd;

    //Ability Process
    let sacAdd = 0;
    let sacChance = false;
    let sacLess = padd;
    opponentDamage += 0.2 * this.health;
    if (fullPercent() <= 50) {
      sacAdd = opponentDamage;
      this.damage += sacAdd;
      sacChance = true;
    }

    //Defense Process
    let d = this.roundDefense();
    opponentDamage = this.defRound(opponentDamage, d);

    //Final Take
    this.health -= opponentDamage;
    if (this.health <= 0) this.health = 0;
    return {
      health: this.health,
      defense: this.defense,
      damage: this.damage,
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
    //Ability 3 Double Chance Fix
    if (this.dcChance) this.damage += this.attack;
    else this.damage = this.attack; //Resets Damage
    this.dcChance = false;

    //Passive Process
    let p = this.passive(opponentDamage);
    //Passive Additional Damage
    let padd = 0.2 * this.health;
    if (p) this.damage += padd;

    //Ability Process
    let dcAL = 0.1 * this.baseHealth;
    opponentDamage += 0.1 * dcAL;
    this.damage += 0.1 * dcAL;
    if (fullPercent() <= 50) this.dcChance = true;
    else this.dcChance = false;

    //Defense Process
    let d = this.roundDefense();
    opponentDamage = this.defRound(opponentDamage, d);

    //Final Take
    this.health -= opponentDamage;
    if (this.health <= 0) this.health = 0;

    return {
      health: this.health,
      defense: this.defense,
      damage: this.damage,
      passiveChance: Math.floor(p),
      passiveDamage: padd,
      defenseRound: Math.floor(d),
      netOpponentDamage: Math.floor(opponentDamage),
      doubleChanceAdd: Math.floor(dcAL),
      doubleChance: this.dcChance,
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

let roundP1 = [];
let roundP2 = [];

let loop = () => {
  let round = 0;
  while (round != 20 && ngina.health > 0 && umay.health > 0) {
    round++;
    console.log("\n\nROUND " + round);
    console.log("\nPlayer 1 : ");
    roundP1.push(ngina.ability1(umay.damage));
    commentator(ngina);
    if (ngina.health <= 0) {
      console.log("Player 2 win!\n");
      break;
    }
    console.log("\nPlayer 2 : ");
    roundP2.push(umay.ability2(ngina.damage));
    commentator(umay);
    if (umay.health <= 0) {
      console.log("Player 1 win!\n");
      break;
    }
  }
};
loop();

console.log(roundP1);
console.log(roundP2);
