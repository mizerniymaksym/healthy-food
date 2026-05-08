// Simulated server JSON data (in real project load via fetch('data.json'))
const MENU_DATA = {
  categories: [
    {
      id: "salads",
      name: "🥗 Salads",
      description: "Fresh, crisp, and nutrient-packed salads for every taste.",
      image: "🥗",
      items: [
        {
          id: "s1",
          name: "Green Garden Salad",
          description:
            "Mixed greens, cherry tomatoes, cucumber, olive oil dressing. Light and refreshing.",
          recipe:
            "1. Wash mixed greens. 2. Chop cherry tomatoes and cucumber. 3. Whisk olive oil, lemon juice, salt, and pepper. 4. Toss everything together.",
          image: "images/green-garden-salad.jpg",
          calories: 185,
          protein: "6g",
          fat: "9g",
          price: "$8.99",
          tags: ["vegan", "gluten-free"],
        },
        {
          id: "s2",
          name: "Caesar Salad",
          description:
            "Romaine lettuce, parmesan, croutons, classic Caesar dressing.",
          recipe:
            "1. Wash and chop romaine lettuce. 2. Toss with Caesar dressing and freshly grated parmesan. 3. Top with crispy baked croutons.",
          image: "images/caesar-salad.jpg",
          calories: 310,
          protein: "30g",
          fat: "18g",
          price: "$10.99",
          tags: ["high-protein"],
        },
        {
          id: "s3",
          name: "Greek Salad",
          description:
            "Tomatoes, olives, feta cheese, red onion, oregano, olive oil.",
          recipe:
            "1. Dice tomatoes and slice red onions. 2. Add pitted Kalamata olives. 3. Toss with olive oil and oregano. 4. Top with large chunks of feta cheese.",
          image: "images/greek-salad.jpg",
          calories: 220,
          protein: "8g",
          fat: "14g",
          price: "$9.99",
          tags: ["vegetarian", "gluten-free"],
        },
        {
          id: "s4",
          name: "Spinach & Strawberry",
          description:
            "Baby spinach, fresh strawberries, walnuts, balsamic vinaigrette.",
          recipe:
            "1. Wash baby spinach and slice fresh strawberries. 2. Lightly toast walnuts in a dry pan. 3. Toss everything gently with balsamic vinaigrette.",
          image: "images/spinach-strawberry.jpg",
          calories: 195,
          protein: "5g",
          fat: "10g",
          price: "$9.49",
          tags: ["vegan", "gluten-free"],
        },
      ],
    },
    {
      id: "bowls",
      name: "🍚 Power Bowls",
      description: "Balanced grain bowls loaded with superfoods.",
      image: "🍚",
      items: [
        {
          id: "b1",
          name: "Quinoa Power Bowl",
          description:
            "Quinoa, roasted sweet potato, chickpeas, tahini dressing, pomegranate.",
          recipe:
            "1. Cook quinoa and roast sweet potato cubes. 2. Rinse and drain chickpeas. 3. Assemble in a bowl, drizzle with tahini dressing, and garnish with pomegranate seeds.",
          image: "images/quinoa-power-bowl.jpg",
          calories: 420,
          protein: "18g",
          fat: "12g",
          price: "$12.99",
          tags: ["vegan", "high-protein"],
        },
        {
          id: "b2",
          name: "Brown Rice Buddha Bowl",
          description:
            "Brown rice, edamame, shredded carrots, avocado, miso dressing.",
          recipe:
            "1. Cook brown rice until fluffy. 2. Shred carrots, slice avocado, and steam edamame. 3. Arrange beautifully in a bowl and top with a savory miso dressing.",
          image: "images/rice-bowl.jpg",
          calories: 390,
          protein: "15g",
          fat: "14g",
          price: "$11.99",
          tags: ["vegan"],
        },
        {
          id: "b3",
          name: "Farro & Roasted Veggie Bowl",
          description:
            "Farro grain, roasted bell peppers, zucchini, cherry tomatoes, pesto.",
          recipe:
            "1. Boil farro until tender. 2. Roast bell peppers, zucchini, and cherry tomatoes with olive oil. 3. Mix grains and veggies, then fold in fresh basil pesto.",
          image: "images/farro-veggie-bowl.jpg",
          calories: 360,
          protein: "13g",
          fat: "11g",
          price: "$11.49",
          tags: ["vegetarian"],
        },
        {
          id: "b4",
          name: "Acai Energy Bowl",
          description:
            "Acai base, banana, granola, blueberries, honey drizzle.",
          recipe:
            "1. Blend frozen acai base with half a banana until smooth and thick. 2. Pour into a bowl. 3. Top with crunchy granola, fresh blueberries, banana slices, and a drizzle of honey.",
          image: "images/acai-energy-bowl.jpg",
          calories: 340,
          protein: "9g",
          fat: "8g",
          price: "$10.99",
          tags: ["vegan"],
        },
      ],
    },
    {
      id: "proteins",
      name: "🍗 Protein Plates",
      description: "High-protein mains for active lifestyles.",
      image: "🍗",
      items: [
        {
          id: "p1",
          name: "Grilled Chicken & Greens",
          description:
            "Herb-marinated chicken breast, steamed broccoli, quinoa, lemon sauce.",
          recipe:
            "1. Marinate chicken in herbs and grill until cooked through. 2. Steam broccoli florets and cook quinoa. 3. Serve chicken over quinoa with a side of broccoli and a squeeze of fresh lemon sauce.",
          image: "images/grilled-chicken-greens.jpg",
          calories: 480,
          protein: "42g",
          fat: "14g",
          price: "$14.99",
          tags: ["high-protein", "gluten-free"],
        },
        {
          id: "p2",
          name: "Salmon & Asparagus",
          description:
            "Atlantic salmon fillet, roasted asparagus, brown rice, dill butter.",
          recipe:
            "1. Pan-sear or bake the salmon fillet. 2. Roast asparagus spears with a touch of olive oil. 3. Serve with cooked brown rice and a dollop of melting dill butter on the salmon.",
          image: "images/salmon-asparagus.jpg",
          calories: 520,
          protein: "38g",
          fat: "22g",
          price: "$16.99",
          tags: ["high-protein", "omega-3"],
        },
        {
          id: "p3",
          name: "Turkey & Veggie Stir-Fry",
          description:
            "Ground turkey, mixed vegetables, ginger-soy sauce, brown rice.",
          recipe:
            "1. Brown ground turkey in a wok. 2. Toss in mixed vegetables (bell peppers, snap peas, carrots) and stir-fry. 3. Add ginger-soy sauce and serve steaming hot over brown rice.",
          image: "images/turkey-veggie.jpg",
          calories: 440,
          protein: "35g",
          fat: "12g",
          price: "$13.99",
          tags: ["high-protein"],
        },
        {
          id: "p4",
          name: "Lentil & Egg Plate",
          description:
            "Spiced lentils, poached eggs, wilted spinach, whole-grain toast.",
          recipe:
            "1. Simmer lentils with warm spices until tender. 2. Wilt spinach lightly in a pan. 3. Poach eggs to a soft yolk. 4. Serve eggs over lentils and spinach with a slice of whole-grain toast.",
          image: "images/lentil-egg.jpg",
          calories: 410,
          protein: "28g",
          fat: "10g",
          price: "$11.99",
          tags: ["vegetarian", "high-protein"],
        },
      ],
    },
    {
      id: "soups",
      name: "🍲 Soups & Stews",
      description: "Warming, nourishing soups for body and soul.",
      image: "🍲",
      items: [
        {
          id: "so1",
          name: "Lentil Detox Soup",
          description:
            "Red lentils, turmeric, ginger, coconut milk, coriander.",
          recipe:
            "1. Sauté fresh ginger and turmeric. 2. Add rinsed red lentils and vegetable broth, simmering until soft. 3. Stir in creamy coconut milk and garnish with fresh coriander.",
          image: "images/lentil-soup.jpg",
          calories: 280,
          protein: "16g",
          fat: "8g",
          price: "$9.99",
          tags: ["vegan", "gluten-free"],
        },
        {
          id: "so2",
          name: "Miso Ramen Bowl",
          description:
            "Miso broth, ramen noodles, soft egg, mushrooms, nori, scallions.",
          recipe:
            "1. Prepare a rich miso broth. 2. Boil ramen noodles and soft-boil an egg. 3. Assemble noodles in the broth, top with sautéed mushrooms, the halved egg, nori sheets, and chopped scallions.",
          image: "images/miso-ramen.jpg",
          calories: 350,
          protein: "18g",
          fat: "9g",
          price: "$12.49",
          tags: ["vegetarian"],
        },
        {
          id: "so3",
          name: "Pumpkin Cream Soup",
          description:
            "Roasted pumpkin, cream, nutmeg, pumpkin seeds, croutons.",
          recipe:
            "1. Roast pumpkin chunks until caramelized and tender. 2. Blend the pumpkin with vegetable broth, a splash of cream, and a pinch of nutmeg. 3. Serve topped with roasted seeds and croutons.",
          image: "images/cream-soup.jpg",
          calories: 240,
          protein: "6g",
          fat: "10g",
          price: "$8.99",
          tags: ["vegetarian", "gluten-free"],
        },
        {
          id: "so4",
          name: "Chicken & Vegetable Stew",
          description:
            "Free-range chicken, root vegetables, herbs, rich broth.",
          recipe:
            "1. Sear chicken pieces in a heavy pot. 2. Add diced carrots, potatoes, and celery. 3. Pour in rich chicken broth, add fresh herbs, and simmer slowly until everything is perfectly tender.",
          image: "images/chicken-stew.jpg",
          calories: 380,
          protein: "30g",
          fat: "10g",
          price: "$13.49",
          tags: ["gluten-free", "high-protein"],
        },
      ],
    },
    {
      id: "smoothies",
      name: "🥤 Smoothies",
      description: "Cold-pressed smoothies and health drinks.",
      image: "🥤",
      items: [
        {
          id: "sm1",
          name: "Green Detox Smoothie",
          description:
            "Spinach, cucumber, green apple, lemon, ginger, coconut water.",
          recipe:
            "1. Add fresh spinach, sliced cucumber, green apple chunks, and a slice of ginger to a blender. 2. Pour in coconut water and a squeeze of lemon. 3. Blend on high until completely smooth.",
          image: "images/green-smoothie.jpg",
          calories: 140,
          protein: "4g",
          fat: "1g",
          price: "$7.99",
          tags: ["vegan", "detox"],
        },
        {
          id: "sm2",
          name: "Berry Blast",
          description:
            "Mixed berries, banana, oat milk, chia seeds, maple syrup.",
          recipe:
            "1. Combine frozen mixed berries, half a banana, and a spoonful of chia seeds in a blender. 2. Add oat milk and a touch of maple syrup. 3. Blend until thick and frosty.",
          image: "images/berry-blast.jpg",
          calories: 210,
          protein: "6g",
          fat: "3g",
          price: "$8.49",
          tags: ["vegan"],
        },
        {
          id: "sm3",
          name: "Tropical Sunrise",
          description:
            "Mango, pineapple, passion fruit, coconut milk, turmeric.",
          recipe:
            "1. Toss frozen mango and pineapple chunks into a blender. 2. Add fresh passion fruit pulp, coconut milk, and a tiny pinch of turmeric for color and health. 3. Blend until silky.",
          image: "images/tropical-sunrise.jpg",
          calories: 190,
          protein: "3g",
          fat: "4g",
          price: "$8.49",
          tags: ["vegan"],
        },
        {
          id: "sm4",
          name: "Protein Peanut Shake",
          description:
            "Banana, peanut butter, oat milk, vanilla protein powder, cacao.",
          recipe:
            "1. Place a frozen banana, a scoop of peanut butter, and vanilla protein powder into a blender. 2. Add a dash of raw cacao and oat milk. 3. Blend into a creamy, high-protein shake.",
          image: "images/peanut-shake.jpg",
          calories: 320,
          protein: "22g",
          fat: "10g",
          price: "$9.99",
          tags: ["high-protein", "vegetarian"],
        },
      ],
    },
    {
      id: "desserts",
      name: "🍮 Healthy Desserts",
      description: "Guilt-free sweet treats made with natural ingredients.",
      image: "🍮",
      items: [
        {
          id: "d1",
          name: "Chia Pudding",
          description:
            "Chia seeds in almond milk, topped with fresh mango and coconut flakes.",
          recipe:
            "1. Whisk chia seeds thoroughly into almond milk with a drop of vanilla. 2. Let sit in the fridge overnight to thicken. 3. Serve topped with fresh diced mango and toasted coconut flakes.",
          image: "images/chia-pudding.jpg",
          calories: 220,
          protein: "7g",
          fat: "9g",
          price: "$6.99",
          tags: ["vegan", "gluten-free"],
        },
        {
          id: "d2",
          name: "Avocado Chocolate Mousse",
          description:
            "Ripe avocado, raw cacao, maple syrup, vanilla — silky and rich.",
          recipe:
            "1. Scoop the flesh of a ripe avocado into a food processor. 2. Add raw cacao powder, maple syrup, and vanilla extract. 3. Blend until incredibly silky. Chill before serving.",
          image: "images/avocado-mousse.jpg",
          calories: 280,
          protein: "4g",
          fat: "18g",
          price: "$7.49",
          tags: ["vegan", "gluten-free"],
        },
        {
          id: "d3",
          name: "Banana Nice Cream",
          description: "Frozen banana blended with almond butter and cinnamon.",
          recipe:
            "1. Slice and freeze bananas overnight. 2. Add frozen banana slices to a powerful blender. 3. Blend with a spoonful of almond butter and a dash of cinnamon until it reaches a soft-serve ice cream texture.",
          image: "images/banana-nice-cream.jpg",
          calories: 195,
          protein: "4g",
          fat: "6g",
          price: "$5.99",
          tags: ["vegan", "gluten-free"],
        },
        {
          id: "d4",
          name: "Oat Energy Balls",
          description:
            "Rolled oats, dates, dark chocolate chips, coconut, hemp seeds.",
          recipe:
            "1. Pulse pitted dates in a food processor until a paste forms. 2. Mix in rolled oats, hemp seeds, and dark chocolate chips. 3. Roll the sticky mixture into bite-sized balls and coat in coconut.",
          image: "images/energy-balls.jpg",
          calories: 160,
          protein: "5g",
          fat: "7g",
          price: "$5.49",
          tags: ["vegan", "snack"],
        },
      ],
    },
  ],
};
