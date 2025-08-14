// Exercise demonstrations with YouTube video links

interface ExerciseDemo {
  name: string;
  youtube_url: string;
  description: string;
  simple_description: string; // Easy-to-understand explanation
}

// Exercise demonstration database with reliable YouTube videos
const exerciseYouTubeDatabase: Record<string, ExerciseDemo> = {
  // Bodyweight exercises
  'squat': {
    name: 'Squat',
    youtube_url: 'https://www.youtube.com/watch?v=YaXPRqUwItQ',
    description: 'Perfect squat form demonstration',
    simple_description: 'Stand with feet shoulder-width apart, lower your body by bending your knees as if sitting in a chair, then stand back up. Keep your chest up and knees behind your toes.'
  },
  'squats': {
    name: 'Squats',
    youtube_url: 'https://www.youtube.com/watch?v=YaXPRqUwItQ',
    description: 'Perfect squat form demonstration',
    simple_description: 'Stand with feet shoulder-width apart, lower your body by bending your knees as if sitting in a chair, then stand back up. Keep your chest up and knees behind your toes.'
  },
  'squat jump': {
    name: 'Squat Jump',
    youtube_url: 'https://www.youtube.com/watch?v=CVaEhXotL7M',
    description: 'Explosive squat jump technique',
    simple_description: 'Perform a regular squat, then explosively jump up as high as you can. Land softly and immediately go into the next squat. Great for building power and burning calories.'
  },
  'squat jumps': {
    name: 'Squat Jumps',
    youtube_url: 'https://www.youtube.com/watch?v=CVaEhXotL7M',
    description: 'Explosive squat jump technique',
    simple_description: 'Perform a regular squat, then explosively jump up as high as you can. Land softly and immediately go into the next squat. Great for building power and burning calories.'
  },
  'push-up': {
    name: 'Push-up',
    youtube_url: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Proper push-up form tutorial',
    simple_description: 'Start in a plank position with hands under shoulders. Lower your chest to the ground by bending your elbows, then push back up. Keep your body straight like a board.'
  },
  'pushup': {
    name: 'Push-up',
    youtube_url: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Proper push-up form tutorial',
    simple_description: 'Start in a plank position with hands under shoulders. Lower your chest to the ground by bending your elbows, then push back up. Keep your body straight like a board.'
  },
  'push up': {
    name: 'Push-up',
    youtube_url: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Proper push-up form tutorial',
    simple_description: 'Start in a plank position with hands under shoulders. Lower your chest to the ground by bending your elbows, then push back up. Keep your body straight like a board.'
  },
  'push-ups': {
    name: 'Push-ups',
    youtube_url: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Proper push-up form tutorial',
    simple_description: 'Start in a plank position with hands under shoulders. Lower your chest to the ground by bending your elbows, then push back up. Keep your body straight like a board.'
  },
  'pushups': {
    name: 'Push-ups',
    youtube_url: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Proper push-up form tutorial',
    simple_description: 'Start in a plank position with hands under shoulders. Lower your chest to the ground by bending your elbows, then push back up. Keep your body straight like a board.'
  },
  'push ups': {
    name: 'Push-ups',
    youtube_url: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Proper push-up form tutorial',
    simple_description: 'Start in a plank position with hands under shoulders. Lower your chest to the ground by bending your elbows, then push back up. Keep your body straight like a board.'
  },
  'push-ups (against a wall or on knees)': {
    name: 'Modified Push-ups',
    youtube_url: 'https://www.youtube.com/watch?v=jWxvty2KROs',
    description: 'Beginner push-up modifications',
    simple_description: 'Easier version of push-ups. Either do them against a wall while standing, or on your knees instead of your toes. Same arm movement, but less body weight to lift.'
  },
  'push-ups (on knees if needed)': {
    name: 'Modified Push-ups',
    youtube_url: 'https://www.youtube.com/watch?v=jWxvty2KROs',
    description: 'Beginner push-up modifications',
    simple_description: 'Easier version of push-ups. Either do them against a wall while standing, or on your knees instead of your toes. Same arm movement, but less body weight to lift.'
  },
  'lunge': {
    name: 'Lunge',
    youtube_url: 'https://www.youtube.com/shorts/1cS-6KsJW9g',
    description: 'Perfect lunge technique',
    simple_description: 'Step forward with one leg and lower your back knee toward the ground. Your front thigh should be parallel to the floor. Push back to starting position and repeat.'
  },
  'lunges': {
    name: 'Lunges',
    youtube_url: 'https://www.youtube.com/shorts/1cS-6KsJW9g',
    description: 'Perfect lunge technique',
    simple_description: 'Step forward with one leg and lower your back knee toward the ground. Your front thigh should be parallel to the floor. Push back to starting position and repeat.'
  },
  'walking lunges': {
    name: 'Walking Lunges',
    youtube_url: 'https://www.youtube.com/watch?v=L8fvypPrzzs',
    description: 'Walking lunge demonstration',
    simple_description: 'Like regular lunges, but instead of stepping back, you step forward into the next lunge. Move across the room with each step, alternating legs.'
  },
  'walking lunge': {
    name: 'Walking Lunge',
    youtube_url: 'https://www.youtube.com/watch?v=L8fvypPrzzs',
    description: 'Walking lunge demonstration',
    simple_description: 'Like regular lunges, but instead of stepping back, you step forward into the next lunge. Move across the room with each step, alternating legs.'
  },
  'plank': {
    name: 'Plank',
    youtube_url: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
    description: 'How to hold a perfect plank',
    simple_description: 'Hold your body straight like a board, supported on your forearms and toes. Keep your core tight and don\'t let your hips sag or pike up. Hold this position.'
  },
  'burpee': {
    name: 'Burpee',
    youtube_url: 'https://www.youtube.com/watch?v=auBLPXO8Fww',
    description: 'Burpee exercise tutorial',
    simple_description: 'Start standing, squat down and put hands on floor, jump feet back to plank, do a push-up, jump feet back to squat, then jump up with arms overhead. Full body exercise!'
  },
  'burpees': {
    name: 'Burpees',
    youtube_url: 'https://www.youtube.com/watch?v=auBLPXO8Fww',
    description: 'Burpee exercise tutorial',
    simple_description: 'Start standing, squat down and put hands on floor, jump feet back to plank, do a push-up, jump feet back to squat, then jump up with arms overhead. Full body exercise!'
  },
  'jumping jacks': {
    name: 'Jumping Jacks',
    youtube_url: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    description: 'Jumping jacks proper form',
    simple_description: 'Start with feet together and arms at sides. Jump while spreading feet wide and raising arms overhead. Jump back to starting position. Great cardio warm-up!'
  },
  'jumping jack': {
    name: 'Jumping Jack',
    youtube_url: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    description: 'Jumping jacks proper form',
    simple_description: 'Start with feet together and arms at sides. Jump while spreading feet wide and raising arms overhead. Jump back to starting position. Great cardio warm-up!'
  },
  'mountain climber': {
    name: 'Mountain Climber',
    youtube_url: 'https://www.youtube.com/watch?v=cnyTQDSE884',
    description: 'Mountain climber exercise guide',
    simple_description: 'Start in plank position. Quickly alternate bringing each knee toward your chest, like running in place horizontally. Keep your core tight and move fast!'
  },
  'mountain climbers': {
    name: 'Mountain Climbers',
    youtube_url: 'https://www.youtube.com/watch?v=cnyTQDSE884',
    description: 'Mountain climber exercise guide',
    simple_description: 'Start in plank position. Quickly alternate bringing each knee toward your chest, like running in place horizontally. Keep your core tight and move fast!'
  },
  'glute bridge': {
    name: 'Glute Bridge',
    youtube_url: 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E',
    description: 'Glute bridge technique',
    simple_description: 'Lie on your back with knees bent. Squeeze your glutes and lift your hips up, creating a straight line from knees to shoulders. Great for strengthening your butt muscles!'
  },
  'bridge': {
    name: 'Glute Bridge',
    youtube_url: 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E',
    description: 'Glute bridge technique',
    simple_description: 'Lie on your back with knees bent. Squeeze your glutes and lift your hips up, creating a straight line from knees to shoulders. Great for strengthening your butt muscles!'
  },
  'calf raise': {
    name: 'Calf Raise',
    youtube_url: 'https://www.youtube.com/watch?v=gwLzBJYoWlI',
    description: 'Calf raise exercise',
    simple_description: 'Stand tall and rise up onto your toes by lifting your heels off the ground. Squeeze your calf muscles at the top, then slowly lower back down.'
  },
  'calf raises': {
    name: 'Calf Raises',
    youtube_url: 'https://www.youtube.com/watch?v=gwLzBJYoWlI',
    description: 'Calf raise exercise',
    simple_description: 'Stand tall and rise up onto your toes by lifting your heels off the ground. Squeeze your calf muscles at the top, then slowly lower back down.'
  },
  'wall sit': {
    name: 'Wall Sit',
    youtube_url: 'https://www.youtube.com/watch?v=y-wV4Venusw',
    description: 'Wall sit exercise tutorial',
    simple_description: 'Lean your back against a wall and slide down until your thighs are parallel to the floor, like sitting in an invisible chair. Hold this position. Burns your leg muscles!'
  },
  'sit-up': {
    name: 'Sit-up',
    youtube_url: 'https://www.youtube.com/watch?v=1fbU_MkV7NE',
    description: 'Proper sit-up technique',
    simple_description: 'Lie on your back with knees bent. Use your abdominal muscles to sit all the way up, then slowly lower back down. Keep your feet on the ground.'
  },
  'situp': {
    name: 'Sit-up',
    youtube_url: 'https://www.youtube.com/watch?v=1fbU_MkV7NE',
    description: 'Proper sit-up technique',
    simple_description: 'Lie on your back with knees bent. Use your abdominal muscles to sit all the way up, then slowly lower back down. Keep your feet on the ground.'
  },
  'sit up': {
    name: 'Sit-up',
    youtube_url: 'https://www.youtube.com/watch?v=1fbU_MkV7NE',
    description: 'Proper sit-up technique',
    simple_description: 'Lie on your back with knees bent. Use your abdominal muscles to sit all the way up, then slowly lower back down. Keep your feet on the ground.'
  },
  'crunch': {
    name: 'Crunch',
    youtube_url: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    description: 'Abdominal crunch exercise',
    simple_description: 'Lie on your back with knees bent. Lift just your head and shoulders off the ground by contracting your abs. Don\'t pull on your neck - use your core muscles.'
  },
  'crunches': {
    name: 'Crunches',
    youtube_url: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    description: 'Abdominal crunch exercise',
    simple_description: 'Lie on your back with knees bent. Lift just your head and shoulders off the ground by contracting your abs. Don\'t pull on your neck - use your core muscles.'
  },
  'inchworm': {
    name: 'Inchworm',
    youtube_url: 'https://www.youtube.com/watch?v=pv_8CdDPAAk&ab_channel=BreakingMuscle',
    description: 'Inchworm exercise demonstration',
    simple_description: 'Stand tall, bend over and walk your hands forward into a plank position, then walk your feet toward your hands. Great full-body warm-up exercise!'
  },
  'bird dog': {
    name: 'Bird Dog',
    youtube_url: 'https://www.youtube.com/watch?v=wiFNA3sqjCA',
    description: 'Bird dog core exercise',
    simple_description: 'Start on hands and knees. Extend opposite arm and leg (like right arm, left leg) and hold. Keep your core tight and don\'t let your hips twist. Great for balance and core!'
  },
  
  // Dumbbell exercises
  'bicep curl': {
    name: 'Bicep Curl',
    youtube_url: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    description: 'Dumbbell bicep curl technique',
    simple_description: 'Hold dumbbells at your sides with palms facing forward. Bend your elbows to curl the weights up toward your shoulders, then slowly lower them back down.'
  },
  'bicep curls': {
    name: 'Bicep Curls',
    youtube_url: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    description: 'Dumbbell bicep curl technique',
    simple_description: 'Hold dumbbells at your sides with palms facing forward. Bend your elbows to curl the weights up toward your shoulders, then slowly lower them back down.'
  },
  'dumbbell curl': {
    name: 'Dumbbell Curl',
    youtube_url: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    description: 'Dumbbell bicep curl technique',
    simple_description: 'Hold dumbbells at your sides with palms facing forward. Bend your elbows to curl the weights up toward your shoulders, then slowly lower them back down.'
  },
  'shoulder press': {
    name: 'Shoulder Press',
    youtube_url: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    description: 'Dumbbell shoulder press',
    simple_description: 'Hold dumbbells at shoulder height with palms facing forward. Press them straight up overhead until your arms are fully extended, then lower back to shoulders.'
  },
  'overhead press': {
    name: 'Overhead Press',
    youtube_url: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    description: 'Overhead press technique',
    simple_description: 'Hold dumbbells at shoulder height with palms facing forward. Press them straight up overhead until your arms are fully extended, then lower back to shoulders.'
  },
  'dumbbell press': {
    name: 'Dumbbell Press',
    youtube_url: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    description: 'Dumbbell press exercise',
    simple_description: 'Hold dumbbells at shoulder height with palms facing forward. Press them straight up overhead until your arms are fully extended, then lower back to shoulders.'
  },
  'chest press': {
    name: 'Chest Press',
    youtube_url: 'https://www.youtube.com/watch?v=VmB1G1K7v94',
    description: 'Dumbbell chest press',
    simple_description: 'Lie on a bench or floor holding dumbbells above your chest. Lower them down to chest level with elbows wide, then press back up. Works your chest muscles.'
  },
  'bench press': {
    name: 'Bench Press',
    youtube_url: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    description: 'Bench press technique',
    simple_description: 'Lie on a bench with barbell above your chest. Lower the bar to your chest, then press it back up. Keep your feet on the floor and core tight.'
  },
  'row': {
    name: 'Row',
    youtube_url: 'https://www.youtube.com/watch?v=roCP6wCXPqo',
    description: 'Dumbbell row exercise',
    simple_description: 'Bend over holding dumbbells with arms hanging down. Pull the weights up to your ribs by squeezing your shoulder blades together, then lower slowly.'
  },
  'rows': {
    name: 'Rows',
    youtube_url: 'https://www.youtube.com/watch?v=roCP6wCXPqo',
    description: 'Dumbbell row exercise',
    simple_description: 'Bend over holding dumbbells with arms hanging down. Pull the weights up to your ribs by squeezing your shoulder blades together, then lower slowly.'
  },
  'dumbbell row': {
    name: 'Dumbbell Row',
    youtube_url: 'https://www.youtube.com/watch?v=roCP6wCXPqo',
    description: 'Dumbbell row exercise',
    simple_description: 'Bend over holding dumbbells with arms hanging down. Pull the weights up to your ribs by squeezing your shoulder blades together, then lower slowly.'
  },
  'deadlift': {
    name: 'Deadlift',
    youtube_url: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    description: 'Deadlift proper form',
    simple_description: 'Stand with feet hip-width apart, bend at hips and knees to grab the weight. Keep your back straight and lift by standing up tall, then lower with control.'
  },
  'deadlifts': {
    name: 'Deadlifts',
    youtube_url: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    description: 'Deadlift proper form',
    simple_description: 'Stand with feet hip-width apart, bend at hips and knees to grab the weight. Keep your back straight and lift by standing up tall, then lower with control.'
  },
  
  // Resistance band exercises
  'resistance band': {
    name: 'Resistance Band Exercise',
    youtube_url: 'https://www.youtube.com/shorts/FHKKZb1N5WE',
    description: 'Resistance band workout',
    simple_description: 'Use stretchy resistance bands to add difficulty to exercises. The bands provide constant tension and can target all muscle groups with various movements.'
  },
  'band pull': {
    name: 'Band Pull',
    youtube_url: 'https://www.youtube.com/shorts/SuvO4TBwSu4',
    description: 'Resistance band pull exercise',
    simple_description: 'Hold ends of resistance band and pull apart by squeezing your shoulder blades together. Great for posture and back strength.'
  },
  
  // Kettlebell exercises
  'kettlebell swing': {
    name: 'Kettlebell Swing',
    youtube_url: 'https://www.youtube.com/watch?v=YSxHifyI6s8',
    description: 'Kettlebell swing technique',
    simple_description: 'Hold kettlebell with both hands, hinge at hips and swing it up to chest height using your hips and glutes. Let it swing back down between your legs.'
  },
  'kettlebell swings': {
    name: 'Kettlebell Swings',
    youtube_url: 'https://www.youtube.com/watch?v=YSxHifyI6s8',
    description: 'Kettlebell swing technique',
    simple_description: 'Hold kettlebell with both hands, hinge at hips and swing it up to chest height using your hips and glutes. Let it swing back down between your legs.'
  },
  'kb swing': {
    name: 'KB Swing',
    youtube_url: 'https://www.youtube.com/watch?v=YSxHifyI6s8',
    description: 'Kettlebell swing technique',
    simple_description: 'Hold kettlebell with both hands, hinge at hips and swing it up to chest height using your hips and glutes. Let it swing back down between your legs.'
  },
  
  // Yoga/Stretching
  'downward dog': {
    name: 'Downward Dog',
    youtube_url: 'https://www.youtube.com/watch?v=ayQoxw8sRTk&ab_channel=Medibank',
    description: 'Downward facing dog pose',
    simple_description: 'Start on hands and knees, tuck toes and lift hips up to form an upside-down V shape. Keep arms and legs straight. Great stretch for hamstrings and calves.'
  },
  'child pose': {
    name: 'Child Pose',
    youtube_url: 'https://www.youtube.com/watch?v=nMp3MlTz9fA&ab_channel=Medibank',
    description: 'Child pose yoga stretch',
    simple_description: 'Kneel on the floor, sit back on your heels, then fold forward with arms extended in front. Rest your forehead on the ground. Very relaxing stretch.'
  },
  'cobra stretch': {
    name: 'Cobra Stretch',
    youtube_url: 'https://www.youtube.com/watch?v=JDcdhTuycOI',
    description: 'Cobra pose stretch',
    simple_description: 'Lie face down, place palms under shoulders and gently push up, lifting your chest while keeping hips on ground. Good stretch for your back and abs.'
  },
  // Yoga Poses
  'sun salutation a': {
    name: 'Sun Salutation A',
    youtube_url: 'https://www.youtube.com/watch?v=VT609I8OlCs&ab_channel=KerstinYoga',
    description: 'Sun Salutation A is a flowing yoga sequence that warms up the entire body. It includes mountain pose, upward salute, forward fold, halfway lift, low push-up, upward facing dog, and downward facing dog.',
    simple_description: 'Flowing yoga sequence from standing to downward dog'
  },
  'warrior ii pose': {
    name: 'Warrior II Pose',
    youtube_url: 'https://www.youtube.com/watch?v=DoC5mh9GxF4&ab',
    description: 'Warrior II is a standing yoga pose that strengthens the legs and opens the hips. Step one foot back, bend the front knee, and extend arms parallel to the ground.',
    simple_description: 'Standing pose with bent front knee and arms extended'
  },
  'tree pose': {
    name: 'Tree Pose',
    youtube_url: 'https://www.youtube.com/watch?v=Fr5kiIygm0c&ab_channel=AloMoves',
    description: 'Tree pose improves balance and strengthens the standing leg. Stand on one foot and place the other foot on the inner thigh or calf of the standing leg.',
    simple_description: 'Balance on one foot with other foot on inner leg'
  },
  'child\'s pose': {
    name: 'Child\'s Pose',
    youtube_url: 'https://www.youtube.com/watch?v=kH12QrSGedM&ab_channel=BaptistHealth',
    description: 'Child\'s pose is a restorative yoga position. Kneel on the floor, sit back on your heels, and fold forward with arms extended or by your sides.',
    simple_description: 'Kneel and fold forward for relaxation'
  },
  // Meditation and Breathwork
  'deep breathing': {
    name: 'Deep Breathing',
    youtube_url: 'https://www.youtube.com/watch?v=gz4G31LGyog&ab_channel=TheHonestGuys-Meditations-Relaxation',
    description: 'Deep breathing exercises help reduce stress and improve focus. Practice the 4-7-8 technique: inhale for 4 counts, hold for 7, exhale for 8.',
    simple_description: 'Controlled breathing pattern: 4-7-8 count'
  },
  'body scan meditation': {
    name: 'Body Scan Meditation',
    youtube_url: 'https://www.youtube.com/watch?v=2FnFXq6Z13Q&ab_channel=Dr.AdamRosen-TotalKnee%26OrthopedicInfo',
    description: 'Body scan meditation involves systematically focusing attention on different parts of the body to promote relaxation and mindfulness.',
    simple_description: 'Progressive relaxation focusing on each body part'
  },
  'gratitude practice': {
    name: 'Gratitude Practice',
    youtube_url: 'https://www.youtube.com/watch?v=xfD4HaBBc0I&ab_channel=JessicaHeslop-ManifestbyJess',
    description: 'Gratitude practice involves reflecting on things you\'re thankful for to improve mental well-being and positive thinking.',
    simple_description: 'Mindful reflection on things you\'re grateful for'
  },
  // Trail Running
  'dynamic warm-up': {
    name: 'Dynamic Warm-up',
    youtube_url: 'https://www.youtube.com/watch?v=LKSC_KujZ4g&ab_channel=KaleighCohenStrength',
    description: 'Dynamic warm-up prepares your body for exercise with movement-based stretches including leg swings, high knees, and butt kicks.',
    simple_description: 'Active movements to prepare body for exercise'
  },
  'trail running intervals': {
    name: 'Trail Running Intervals',
    youtube_url: 'https://www.youtube.com/watch?v=qOYndQjEDfs&ab_channel=adidas',
    description: 'Trail running intervals involve alternating between high and low intensity running periods to improve cardiovascular fitness and endurance.',
    simple_description: 'Alternating hard and easy running periods'
  },
  'hill sprints': {
    name: 'Hill Sprints',
    youtube_url: 'https://www.youtube.com/watch?v=6OwwCVSeN8o&ab_channel=BenParkes',
    description: 'Hill sprints are short, intense uphill runs that build power, speed, and strength. Run uphill at near maximum effort for short periods.',
    simple_description: 'Short intense uphill runs for power development'
  },
  'cool down walk': {
    name: 'Cool Down Walk',
    youtube_url: 'https://www.youtube.com/watch?v=Qy3U09CnELI&ab_channel=OliverSjostrom',
    description: 'Cool down walking gradually reduces heart rate and helps prevent muscle stiffness after intense exercise.',
    simple_description: 'Gradual walking to reduce heart rate after exercise'
  },
  // HIIT Exercises
  'plank hold': {
    name: 'Plank Hold',
    youtube_url: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
    description: 'Plank hold strengthens the core muscles. Maintain a straight line from head to heels while supporting your body on forearms and toes.',
    simple_description: 'Hold straight body position to strengthen core'
  },
  // Basketball Drills
  'dribbling drills': {
    name: 'Dribbling Drills',
    youtube_url: 'https://www.youtube.com/shorts/SOvS-9CrUyA',
    description: 'Basketball dribbling drills improve ball handling skills. Practice controlling the ball with both hands at various speeds and directions.',
    simple_description: 'Practice controlling basketball with both hands'
  },
  'defensive slides': {
    name: 'Defensive Slides',
    youtube_url: 'https://www.youtube.com/watch?v=HHFzW6lhjmM&ab_channel=BeijingFalconsBasketball',
    description: 'Defensive slides improve lateral movement and defensive positioning in basketball. Stay low and move quickly side to side.',
    simple_description: 'Quick lateral movements in low defensive stance'
  },
  'jump shots': {
    name: 'Jump Shots',
    youtube_url: 'https://www.youtube.com/watch?v=Ph6-w-LCpYo&ab_channel=ILoveBasketballTV',
    description: 'Jump shots are the fundamental shooting technique in basketball. Focus on proper form, follow-through, and consistent release.',
    simple_description: 'Basketball shooting technique with proper form'
  },
  'suicide runs': {
    name: 'Suicide Runs',
    youtube_url: 'https://www.youtube.com/watch?v=MPL487ToJt8&t=7s&ab_channel=LIVESTRONG',
    description: 'Suicide runs are basketball conditioning drills involving sprinting to different court lines and back to improve speed and agility.',
    simple_description: 'Sprint to court lines and back for conditioning'
  },
  // Lower Back Rehabilitation
  'cat-cow stretch': {
    name: 'Cat-Cow Stretch',
    youtube_url: 'https://www.youtube.com/watch?v=K9bK0BwKFjs&ab_channel=AskDoctorJo',
    description: 'Cat-cow stretch improves spinal mobility and relieves back tension. Alternate between arching and rounding your back while on hands and knees.',
    simple_description: 'Spinal mobility exercise arching and rounding back'
  },
  'pelvic tilts': {
    name: 'Pelvic Tilts',
    youtube_url: 'https://www.youtube.com/watch?v=ZIQjHtghzqw&ab_channel=BaptistHealth',
    description: 'Pelvic tilts strengthen the core and improve lower back mobility. Gently tilt your pelvis while lying on your back or standing.',
    simple_description: 'Gentle core exercise tilting pelvis back and forth'
  },
  'knee-to-chest stretch': {
    name: 'Knee-to-Chest Stretch',
    youtube_url: 'https://www.youtube.com/watch?v=yVy4L0CGbyQ&ab_channel=CornerstonePhysiotherapy',
    description: 'Knee-to-chest stretch relieves lower back tension by gently stretching the lower back and hip flexor muscles.',
    simple_description: 'Gentle stretch pulling knee toward chest'
  },
  // Desk Break Exercises
  'neck rolls': {
    name: 'Neck Rolls',
    youtube_url: 'https://www.youtube.com/watch?v=X-CUlo4zf0Y&ab_channel=MadePossiblePersonalTraining',
    description: 'Neck rolls relieve tension from prolonged sitting. Slowly roll your head in circles to stretch neck muscles.',
    simple_description: 'Slow circular head movements to stretch neck'
  },
  'shoulder shrugs': {
    name: 'Shoulder Shrugs',
    youtube_url: 'https://www.youtube.com/watch?v=ja_P3YhmAlE&ab_channel=AskDoctorJo',
    description: 'Shoulder shrugs relieve tension in the shoulder and neck area. Lift shoulders toward ears, hold briefly, then release.',
    simple_description: 'Lift shoulders up and down to relieve tension'
  },
  'seated spinal twist': {
    name: 'Seated Spinal Twist',
    youtube_url: 'https://www.youtube.com/watch?v=qEVNj4tcr0Y&ab_channel=Health',
    description: 'Seated spinal twist improves spinal mobility and relieves back tension from sitting. Rotate your torso while keeping feet planted.',
    simple_description: 'Twist spine while seated to improve mobility'
  },
  'ankle circles': {
    name: 'Ankle Circles',
    youtube_url: 'https://www.youtube.com/shorts/Pby8XRtSjpk',
    description: 'Ankle circles improve circulation and prevent stiffness from prolonged sitting. Rotate ankles in both directions.',
    simple_description: 'Circular ankle movements to improve circulation'
  }
};

/**
 * Get exercise demonstration - Returns YouTube link, description, and simple explanation
 */
export function getExerciseDemo(exerciseName: string): { youtube_url: string; description: string; simple_description: string } | null {
  if (!exerciseName) return null;
  
  const normalizedName = exerciseName?.toLowerCase().trim() || '';
  console.log('Exercise demo requested for:', normalizedName);
  
  const demo = exerciseYouTubeDatabase[normalizedName];
  if (demo) {
    console.log('Found YouTube demo:', demo.youtube_url);
    return {
      youtube_url: demo.youtube_url,
      description: demo.description,
      simple_description: demo.simple_description
    };
  }
  
  console.log('No YouTube demo found for:', normalizedName);
  return null;
}

/**
 * Get exercise visual aid - Legacy function, now returns YouTube URL
 */
export function getExerciseGif(exerciseName: string): string | null {
  const demo = getExerciseDemo(exerciseName);
  return demo ? demo.youtube_url : null;
}

/**
 * Add YouTube demonstration URLs to exercise list
 */
export function addDemosToExercises(exercises: Array<{ exercise: string; [key: string]: any }>): Array<{ exercise: string; youtube_url?: string; demo_description?: string; simple_description?: string; [key: string]: any }> {
  return exercises.map(exercise => {
    const demo = getExerciseDemo(exercise.exercise);
    return {
      ...exercise,
      youtube_url: demo?.youtube_url,
      demo_description: demo?.description,
      simple_description: demo?.simple_description
    };
  });
}

/**
 * Add visual aid URLs to exercise list - Legacy function for backward compatibility
 */
export function addGifsToExercises(exercises: Array<{ exercise: string; [key: string]: any }>): Array<{ exercise: string; gif_url?: string; [key: string]: any }> {
  return exercises.map(exercise => ({
    ...exercise,
    gif_url: getExerciseGif(exercise.exercise) || undefined
  }));
}
