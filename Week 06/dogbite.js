class Dog{
      constructor(name, damage){
          this.name = name;
          this.damage = damage;
      }
      bite(){
          return this.damage;
      }
  }
  
  class Human{
      constructor(name, health = 100){
          this.name = name;
          this.health = health;
      }
      hurt(damage){
          this.health -= damage;
          return this.health;
      }
  }
  
  console.log(new Human('AMan').hurt(new Dog("BDog", 20).bite()));
  