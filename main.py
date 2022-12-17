# 这是每次院长筛选动物时候都会调用的函数
# 三个参数分别代表有多少只脚、有没有翅膀、是否温血动物

def on_register_filter_handler(feet, wings, warm_blood):
    # 这个函数要做的，就是通过下面这个sumbit_answer函数提交正确的动物名单
    # 比如下面就会提交猫和蛇
    zoo.sumbit_answer(["猫", "蛇"])
zoo.register_filter_handler(on_register_filter_handler)

# 这是每天动物园开门营业的时候会调用的函数
# 当天有多少只动物登场，就会调用多少次
# name - 动物的名称  （字符串）
# feet - 动物有几只脚  (数字)
# wings - 动物有没有翅膀 （布尔值）
# warm_blood - 动物是不是温血动物 （布尔值）
# 这个里面你随意

def on_register_animal_enter_handler(name, feet2, wings2, warm_blood2):
    pass
zoo.register_on_animal_enter_handler(on_register_animal_enter_handler)

# 准备好上面两个函数的内容，动物园就可以开门营业了
# 参数决定是否跳过介绍环节 （跳过可以节省测试时间）
zoo.init(False, zoo.Mode.FEET_ONLY)