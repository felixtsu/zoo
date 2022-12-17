namespace SpriteKind {
    export const _ANIMAL_INTERNAL_SPRITE_KIND = SpriteKind.create()
}

//%block="动物园的故事"
//%weight=100 icon="\u2303"
namespace zoo {

    let ANIMALS: AnimalInternal[]
    let animalMap: { [key: string]: AnimalInternal } = {}
    let _skipIntroduction: boolean = false;
    let _advanceMode = false;

    let animalsOnStage: AnimalInternal[] = []
    let animalEnterHandler: (name: string, feet: number, wings: boolean, warmBlood: boolean) => void = null
    let filterHandler: (feet: number, wings: boolean, warmBlood: boolean) => void = null

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
            if (this.name == '鱼') {
                this.sprite.x = 112
                this.sprite.y = 92
            } else {
                tiles.placeOnRandomTile(this.sprite, sprites.castle.tileGrass1)
            }
        }

    }

    function randomFilterKeywords() : AnimalInternal {
        let keyword = new AnimalInternal(null, null, randint(0,2) * 2, Math.percentChance(50), Math.percentChance(50))
        if (_advanceMode) {
            let keptField = randint(0, 2)
            if (keptField == 0) {
                keyword.wings = null
                keyword.warmBlood = null
            } else if (keptField == 1) {
                keyword.feet == null
                keyword.warmBlood = null
            } else {
                keyword.feet == null
                keyword.wings = null
            }
        }
        
        return keyword
    }

    function describeKeyword(keyword:AnimalInternal) :string {
        let result = "请"
        if (keyword.feet != null) {
            result += keyword.feet + "只脚\n"
        }
        if (keyword.wings != null) {
            result += (keyword.wings ? "有" : "没有") + "翅膀\n"
        }

        if (keyword.warmBlood != null) {
            result += (keyword.warmBlood ? "温" :"冷") + "血动物\n"
        }
        result += "举手"
        return result
    }



    //% blockId=init_game
    //% block="开门营业 进阶模式%advanceMode=toggleOnOff 跳过对话 %skipIntroduction=toggleOnOff"
    //% skipIntroduction.defl=false
    //% advanceMode.defl=false
    export function init(skipIntroduction: boolean, advanceMode : boolean ) {
        _skipIntroduction = skipIntroduction
        _advanceMode = advanceMode
        tiles.setTilemap(assets.tilemap`default`)
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
                if (keyword.feet != null && animal.feet != keyword.feet) {
                    continue
                }
                if (keyword.wings != null && animal.wings != keyword.wings) {
                    continue
                }
                if (keyword.warmBlood != null && animal.warmBlood != keyword.warmBlood) {
                    continue
                }
                correctAnswer.push(animal.name)
            }

            game.showLongText(describeKeyword(keyword), DialogLayout.Center)

            filterHandler(keyword.feet, keyword.wings, keyword.warmBlood)

            checkAnswer(keyword, correctAnswer)

        }    
    }

    function checkAnswer(keyword : AnimalInternal, correctAnswer:string[]) {
        
        for (let a of lastAnswer) {
            let animal = animalMap[a]

            if (animal == null) {
                game.splash(a + "都不在")
                game.over()
            }

            animal.sprite.sayText("我")
            if (keyword.feet != null && keyword.feet != animal.feet) {
                pause(1000)
                animal.sprite.sayText("我好像有" + animal.feet + "条腿嗯",2000)
                pause(2000)
                game.over()
            }
            if (keyword.wings != null && keyword.wings != animal.wings) {
                pause(1000)
                animal.sprite.sayText("我好像" + animal.wings ? "" : "没" + "有翅膀嗯", 2000 )
                pause(2000)
                game.over()
            }
            if (keyword.warmBlood != null && keyword.warmBlood != animal.warmBlood) {
                pause(1000)
                animal.sprite.sayText("我好像是" + animal.warmBlood ? "温" : "冷" + "血动物嗯", 2000)
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
        if (!_skipIntroduction) {
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

        for (let animal of animalsOnStage) {
            animalEnterHandler(animal.name, animal.feet, animal.wings, animal.warmBlood)
        }
        
    }


    //% blockId=on_animal_enter_handler
    //% block="动物登场"
    //% draggableParameters
    export function registerOnAnimalEnterHandler(cb: (name :string, feet:number, wings:boolean, warmBlood:boolean) =>void ) {
        animalEnterHandler = cb;
    }


    //% blockId=on_filter_handler
    //% block="筛选动物"
    //% draggableParameters
    export function registerFilterHandler(cb: (feet:number, wings:boolean, warmBlood:boolean)=>void) {
        filterHandler = cb;
    }

    let lastAnswer :string[];

    //% blockId=sumbit_answer
    //% block="叫 $answer=variables_get(list) 举手"
    export function sumbitAnswer(answer: string[]) {
        lastAnswer = answer
    }


}