import { SentimentType } from "../types";
import { SENTIMENT_COLORS } from "../constants";

// Mock sentiment analysis (formerly utilizing AI)
export const analyzeSentiment = async (text: string): Promise<{ sentiment: SentimentType; color: string; isSafe: boolean }> => {
  // Return neutral by default for safety in this demo version
  return {
    sentiment: SentimentType.NEUTRAL,
    color: SENTIMENT_COLORS[SentimentType.NEUTRAL],
    isSafe: true
  };
};

const STATIC_POSTS = [
  { text: "My bed is a magical place where I suddenly remember everything I forgot to do.", sentiment: SentimentType.NEUTRAL },
  { text: "I put the 'pro' in procrastination.", sentiment: SentimentType.HAPPY },
  { text: "Currently holding it all together with a bobby pin.", sentiment: SentimentType.SAD },
  { text: "Why do they call it rush hour when nothing moves?", sentiment: SentimentType.ANGRY },
  { text: "I need a six-month holiday, twice a year.", sentiment: SentimentType.SAD },
  { text: "Diet status: I just ate a bag of chips in self-defense.", sentiment: SentimentType.HAPPY },
  { text: "I'm not lazy, I'm on energy saving mode.", sentiment: SentimentType.NEUTRAL },
  { text: "Coffee: because anger management is too expensive.", sentiment: SentimentType.EXCITING },
  { text: "Life is short. Smile while you still have teeth.", sentiment: SentimentType.HAPPY },
  { text: "I followed my heart, and it led me to the fridge.", sentiment: SentimentType.LOVING },
  { text: "Maybe she's born with it. Maybe it's caffeine.", sentiment: SentimentType.EXCITING },
  { text: "My hobbies include eating and complaining that I'm getting fat.", sentiment: SentimentType.SAD },
  { text: "I walked into a room and forgot why. It’s a lifestyle.", sentiment: SentimentType.NEUTRAL },
  { text: "Dear Sleep, I’m sorry we broke up this morning. I want you back!", sentiment: SentimentType.LOVING },
  { text: "Adulting is just Googling how to do stuff.", sentiment: SentimentType.NEUTRAL },
  { text: "My wallet is like an onion, opening it makes me cry.", sentiment: SentimentType.SAD },
  { text: "I’m not arguing, I’m just explaining why I’m right.", sentiment: SentimentType.ANGRY },
  { text: "Common sense is not that common.", sentiment: SentimentType.ANGRY },
  { text: "I wish I could invoice people for wasting my time.", sentiment: SentimentType.ANGRY },
  { text: "Sarcasm is just one of the many services I offer.", sentiment: SentimentType.HAPPY },
  { text: "Wi-Fi went down for five minutes, so I had to talk to my family.", sentiment: SentimentType.NEUTRAL },
  { text: "I’m not weird, I’m limited edition.", sentiment: SentimentType.EXCITING },
  { text: "Don’t grow up, it’s a trap!", sentiment: SentimentType.EXCITING },
  { text: "Reality called, so I hung up.", sentiment: SentimentType.NEUTRAL },
  { text: "Everything happens for a reason. Usually the reason is I made a bad decision.", sentiment: SentimentType.SAD },
  { text: "The bags under my eyes are designer.", sentiment: SentimentType.NEUTRAL },
  { text: "I’m in shape. Round is a shape.", sentiment: SentimentType.HAPPY },
  { text: "Math: Mental Abuse To Humans.", sentiment: SentimentType.ANGRY },
  { text: "I finally realized that people are prisoners of their phones... that's why it's called a cell phone.", sentiment: SentimentType.NEUTRAL },
  { text: "I’m actually not funny. I’m just really mean and people think I’m joking.", sentiment: SentimentType.NEUTRAL },
  { text: "My relationship status: Netflix and Oreos.", sentiment: SentimentType.LOVING },
  { text: "Is 'ugh' an emotion? Because I feel it.", sentiment: SentimentType.SAD },
  { text: "Running late is my cardio.", sentiment: SentimentType.EXCITING },
  { text: "If you fall, I’ll be there. - Floor", sentiment: SentimentType.LOVING },
  { text: "Chocolate doesn't ask silly questions, chocolate understands.", sentiment: SentimentType.LOVING },
  { text: "Just saw a spider. burning the house down. brb.", sentiment: SentimentType.EXCITING },
  { text: "I’m on a seafood diet. I see food and I eat it.", sentiment: SentimentType.HAPPY },
  { text: "Friday is my second favorite F word.", sentiment: SentimentType.HAPPY },
  { text: "I’m 99% angel, but oh, that 1%...", sentiment: SentimentType.EXCITING },
  { text: "Silence is golden. Duct tape is silver.", sentiment: SentimentType.ANGRY },
  { text: "Stressed, depressed, but well dressed.", sentiment: SentimentType.NEUTRAL },
  { text: "Namaste in bed.", sentiment: SentimentType.NEUTRAL },
  { text: "Money can't buy happiness, but it can buy tacos.", sentiment: SentimentType.HAPPY },
  { text: "Be a cupcake in a world of muffins.", sentiment: SentimentType.LOVING },
  { text: "Don't follow me, I'm lost too.", sentiment: SentimentType.NEUTRAL },
  { text: "Born to express, not to impress.", sentiment: SentimentType.EXCITING },
  { text: "Error 404: Motivation not found.", sentiment: SentimentType.SAD },
  { text: "Going to bed early. Not going to a party. My childhood punishments has become my adult goals.", sentiment: SentimentType.NEUTRAL },
  { text: "A balanced diet means a cupcake in each hand.", sentiment: SentimentType.HAPPY },
  { text: "Hard work pays off in the future. Laziness pays off now.", sentiment: SentimentType.HAPPY },
  { text: "Who decided that 5 days of work and 2 days of weekend was fair?", sentiment: SentimentType.ANGRY },
  { text: "Life is too short to remove USB safely.", sentiment: SentimentType.EXCITING },
  { text: "I whispered to my wifi 'be strong', but it's weak.", sentiment: SentimentType.SAD },
  { text: "I’m not great at advice. Can I interest you in a sarcastic comment?", sentiment: SentimentType.NEUTRAL },
  { text: "Just dropped a piece of ice on the floor. Now it's a water mess.", sentiment: SentimentType.SAD },
  { text: "The future is shaped by your dreams, so stop wasting time and go to sleep!", sentiment: SentimentType.HAPPY },
  { text: "If at first you don't succeed, then skydiving isn't for you.", sentiment: SentimentType.EXCITING },
  { text: "My brain has too many tabs open.", sentiment: SentimentType.EXCITING },
  { text: "At night, I can't sleep. In the morning, I can't wake up.", sentiment: SentimentType.SAD },
  { text: "Doing nothing is hard, you never know when you're done.", sentiment: SentimentType.NEUTRAL },
  { text: "Some days I amaze myself. Other days I look for my phone while I'm holding it.", sentiment: SentimentType.HAPPY },
  { text: "Teamwork makes the dream work, but a vision becomes a nightmare when the leader has a big dream and a bad team.", sentiment: SentimentType.ANGRY },
  { text: "I love the sound you make when you shut up.", sentiment: SentimentType.ANGRY },
  { text: "I’m not shy, I’m holding back my awesomeness so I don’t intimidate you.", sentiment: SentimentType.HAPPY },
  { text: "If we shouldn't eat at night, why is there a light in the fridge?", sentiment: SentimentType.NEUTRAL },
  { text: "My favorite exercise is a cross between a lunge and a crunch. I call it lunch.", sentiment: SentimentType.HAPPY },
  { text: "Fries before guys.", sentiment: SentimentType.LOVING },
  { text: "Be the person your dog thinks you are.", sentiment: SentimentType.LOVING },
  { text: "Just rescued some wine. It was trapped in a bottle.", sentiment: SentimentType.HAPPY },
  { text: "Of course I talk to myself. Sometimes I need expert advice.", sentiment: SentimentType.NEUTRAL },
  { text: "The only running I do is out of money.", sentiment: SentimentType.SAD },
  { text: "I’m not always right, but I’m never wrong.", sentiment: SentimentType.HAPPY },
  { text: "Clever as the Devil and twice as pretty.", sentiment: SentimentType.EXCITING },
  { text: "Kindness is free, sprinkle that stuff everywhere.", sentiment: SentimentType.LOVING },
  { text: "Throw kindness around like confetti.", sentiment: SentimentType.LOVING },
  { text: "Focus on the good.", sentiment: SentimentType.HAPPY },
  { text: "Be a voice, not an echo.", sentiment: SentimentType.EXCITING },
  { text: "Create your own sunshine.", sentiment: SentimentType.HAPPY },
  { text: "Every day is a fresh start.", sentiment: SentimentType.EXCITING },
  { text: "Dream big, pray bigger.", sentiment: SentimentType.LOVING },
  { text: "Do more of what makes you happy.", sentiment: SentimentType.HAPPY },
  { text: "Good vibes only.", sentiment: SentimentType.HAPPY },
  { text: "Stay wild, moon child.", sentiment: SentimentType.EXCITING },
  { text: "Keep calm and carry on.", sentiment: SentimentType.NEUTRAL },
  { text: "Happiness looks gorgeous on you.", sentiment: SentimentType.LOVING },
  { text: "Collect moments, not things.", sentiment: SentimentType.NEUTRAL },
  { text: "Choose joy.", sentiment: SentimentType.HAPPY },
  { text: "Believe in yourself.", sentiment: SentimentType.EXCITING },
  { text: "You are enough.", sentiment: SentimentType.LOVING },
  { text: "Inhale confidence, exhale doubt.", sentiment: SentimentType.NEUTRAL },
  { text: "Broken crayons still color.", sentiment: SentimentType.SAD },
  { text: "Stars can't shine without darkness.", sentiment: SentimentType.NEUTRAL },
  { text: "Grow through what you go through.", sentiment: SentimentType.EXCITING },
  { text: "Life is tough, but so are you.", sentiment: SentimentType.EXCITING },
  { text: "One day at a time.", sentiment: SentimentType.NEUTRAL },
  { text: "This too shall pass.", sentiment: SentimentType.SAD },
  { text: "The best is yet to come.", sentiment: SentimentType.EXCITING },
  { text: "You got this.", sentiment: SentimentType.HAPPY },
  { text: "Small steps every day.", sentiment: SentimentType.NEUTRAL },
  { text: "Make it happen.", sentiment: SentimentType.EXCITING },
  { text: "Love yourself first.", sentiment: SentimentType.LOVING },
  // Khmer Posts
  { text: "ជីវិតគឺជាការតស៊ូ ប៉ុន្តែថ្ងៃនេះសុំខ្ជិលសិន។", sentiment: SentimentType.HAPPY },
  { text: "ឃ្លានរហូត មិនដឹងមកពីក្រពះ ឬមកពីអារម្មណ៍។", sentiment: SentimentType.NEUTRAL },
  { text: "កុំបោះបង់ក្តីស្រមៃ បន្តដេកទៀតទៅ។", sentiment: SentimentType.HAPPY },
  { text: "លុយមិនអាចទិញសុភមង្គលបានទេ តែវាអាចទិញសាច់គោអាំងបាន។", sentiment: SentimentType.EXCITING },
  { text: "ថ្ងៃនេះក្តៅខ្លាំង ស្មានតែនៅក្បែរព្រះអាទិត្យ។", sentiment: SentimentType.ANGRY },
  { text: "មនុស្សល្អដូចខ្ញុំ គួរតែមានពីរនាក់លើលោក។", sentiment: SentimentType.LOVING },
  { text: "សេដតិចៗ តែមិនអីទេ នៅតែស្អាត។", sentiment: SentimentType.SAD },
  { text: "ការងារច្រើនណាស់ ចង់តែទៅរស់នៅភពអង្គារ។", sentiment: SentimentType.ANGRY },
  { text: "ស្រលាញ់ខ្លួនឯង ឱ្យច្រើនជាងអ្នកដទៃ។", sentiment: SentimentType.LOVING },
  { text: "ញញឹមដាក់បញ្ហា បញ្ហានឹងឆ្ងល់ថាឆ្កួតឬអត់។", sentiment: SentimentType.HAPPY }
];

export const generateInitialPosts = async (count: number = 20): Promise<Array<{ text: string; sentiment: SentimentType; color: string }>> => {
  // Simulate network delay for a more realistic feel (reduced for pagination)
  await new Promise(resolve => setTimeout(resolve, 800));

  // Create a larger pool by duplicating static posts to ensure we can fulfill high counts (like 100)
  // independent of the source list size.
  const pool = [...STATIC_POSTS, ...STATIC_POSTS, ...STATIC_POSTS];
  const shuffled = pool.sort(() => 0.5 - Math.random());
  
  // Return the requested subset
  return shuffled.slice(0, count).map(post => ({
    text: post.text,
    sentiment: post.sentiment as SentimentType,
    color: SENTIMENT_COLORS[post.sentiment as SentimentType] || SENTIMENT_COLORS[SentimentType.NEUTRAL]
  }));
}