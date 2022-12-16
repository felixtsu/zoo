namespace SpriteKind {
    export const _ANIMAL_INTERNAL_SPRITE_KIND = SpriteKind.create()
}

namespace zoo {

    class AnimalInternal {

        sprite:Sprite
        spriteImage:Image
        name:string
        feet:number
        wings:boolean
        warmBlood:boolean

        public constructor(spriteImage:Image, name:string, feet:number, wings:boolean, warmBlood:boolean) {
            this.spriteImage = spriteImage;
            this.name = name;
            this.feet = feet;
            this.wings = wings;
            this.warmBlood = warmBlood;
        }

        public _init() {
            this.sprite = sprites.create(this.spriteImage, SpriteKind._ANIMAL_INTERNAL_SPRITE_KIND)
        }

    }

    function randomFilterKeywords() : AnimalInternal {
        return new AnimalInternal(null, null, randint(0,2) * 2, Math.percentChance(50), Math.percentChance(50))
    }



    let ANIMALS :AnimalInternal[]
    let animalMap: { [key: string]: AnimalInternal} = {}

    let animalsOnStage:AnimalInternal[]= []
    let animalEnterHandler : (sprite: Sprite, name : string, feet: number, wings: boolean, warmBlood: boolean) => void = null
    let filterHandler : (feet: number, wings: boolean, warmBlood: boolean)=> void = null

    export function init() {
        ANIMALS = [
            new AnimalInternal(assets.image`cat`, "猫", 4, false, true),
            new AnimalInternal(assets.image`dog`, "狗", 4, false, true),
            new AnimalInternal(assets.image`pigeon`, "鸽子", 2, true, true),
            new AnimalInternal(assets.image`snake`, "蛇", 0, false, false),
            new AnimalInternal(assets.image`snail`, "蜗牛", 0, false, false),
            new AnimalInternal(assets.image`fish`, "鱼", 0, false, false),
            new AnimalInternal(assets.image`monkey`, "猴子", 2, false, true),
            new AnimalInternal(assets.image`duck`, "鸭子", 2, true, true),
        ]
        let numberOfAnimals = randint(6, 8)
        for (let i = 0; i < numberOfAnimals; i++ ) {
            let presentAnimal = ANIMALS.removeAt(randint(0, ANIMALS.length - 1))
            presentAnimal._init()
            animalMap[presentAnimal.name] = presentAnimal
            animalsOnStage.push(presentAnimal)
        }

        sprites.onOverlap(SpriteKind._ANIMAL_INTERNAL_SPRITE_KIND, SpriteKind._ANIMAL_INTERNAL_SPRITE_KIND, (sprite:Sprite, otherSprite:Sprite)=> {
            otherSprite.x = randint(10, 150)
            otherSprite.y = randint(10, 110)
        })

        introduceAnimals()

        for (let i = 0 ; i < 3; i++) {
            let keyword = randomFilterKeywords()
            let correctAnswer = [] 
            for (let animal of animalsOnStage) {
                if (animal.feet != keyword.feet) {
                    continue
                }
                if (animal.wings != keyword.wings) {
                    continue
                }
                if (animal.warmBlood != keyword.warmBlood) {
                    continue
                }
                correctAnswer.push(animal.name)
            }

            game.splash("请" + keyword.feet + "条腿的" + (keyword.wings ?"" :"没") + "有翅膀的" + (keyword.warmBlood ?"温" : "冷") + "血动物举手")

            filterHandler(keyword.feet, keyword.wings, keyword.warmBlood)

            checkAnswer(keyword, correctAnswer)

        }    
    }

    function checkAnswer(keyword : AnimalInternal, correctAnswer:string[]) {
        
        for (let a of lastAnswer) {
            let animal = animalMap[a]
            animal.sprite.sayText("我")
            if (keyword.feet != animal.feet) {
                pause(1000)
                animal.sprite.sayText("我好像有" + animal.feet + "条腿嗯")
                pause(2000)
                game.over()
            }
            if (keyword.wings != animal.wings) {
                pause(1000)
                animal.sprite.sayText("我好像" + animal.wings ? "" : "没" + "有翅膀嗯" )
                pause(2000)
                game.over()
            }
            if (keyword.wings != animal.wings) {
                pause(1000)
                animal.sprite.sayText("我好像是" + animal.warmBlood ? "温" : "冷" + "血动物嗯")
                pause(2000)
                game.over()
            }
            correctAnswer.removeElement(a)
        }

        if (correctAnswer.length != 0) {
            for (let c of correctAnswer) {
                let animal = animalMap[c]
                animal.sprite.sayText("我也是的啊")
            }
            pause(2000)
            game.over()
        }

    }

    function introduceAnimals() {

        for (let animal of animalsOnStage) {
            animal.sprite.x += randint(-60, 60)
            animal.sprite.y += randint(-40, 40)
        }

        game.splash("自我介绍一下吧")

        for (let animal of animalsOnStage) {
            animal.sprite.sayText(animal.name, 2000)
        }
        pause(2000)

        game.splash("你们有几条腿")
        for (let animal of animalsOnStage) {
            animal.sprite.sayText(animal.feet, 2000)
        }
        pause(2000)

        game.splash("有翅膀吗？")
        for (let animal of animalsOnStage) {
            animal.sprite.sayText(animal.wings ? "有" : "没有", 2000)
        }
        pause(2000)

        game.splash("温血动物吗")
        for (let animal of animalsOnStage) {
            animal.sprite.sayText(animal.warmBlood ? "是" : "否", 2000)
        }
        pause(2000)
        
    }

    export function registerOnAnimalEnterHandler(cb: (sprite:Sprite, name :string, feet:number, wings:boolean, warmBlood:boolean) =>void ) {
        animalEnterHandler = cb;
    }

    export function registerFilterHandler(cb: (feet:number, wings:boolean, warmBlood:boolean)=>void) {
        filterHandler = cb;
    }

    let lastAnswer :string[];

    export function sumbitAnswer(answer: string[]) {
        lastAnswer = answer
    }


}