import random
import time

def slow_print(text):
    """Prints text slowly for calm effect"""
    for char in text:
        print(char, end='', flush=True)
        time.sleep(0.02)
    print()

def mind_care_chatbot():
    slow_print("🌿 Welcome to Mind_Care – Your Mental Wellness Companion 🌿")
    slow_print("I'm here to listen and guide you toward a calm mind.\n")

    responses = {
        "sad": [
            "I’m really sorry you’re feeling low today. 💛 Try taking a deep breath.",
            "Sometimes a short walk or listening to music can lift your mood.",
            "It’s okay to not feel okay. Would you like a self-care tip?"
        ],
        "stressed": [
            "Let’s pause for a second and breathe deeply together. 🌬️",
            "Stress is your body asking for rest — maybe take a break?",
            "Try writing your thoughts down — journaling helps release stress."
        ],
        "happy": [
            "That’s wonderful! Keep spreading your positive energy 🌞",
            "I’m so glad you’re happy today — keep doing what makes you smile!",
            "Joy shared is joy doubled 💚"
        ],
        "angry": [
            "It’s okay to feel angry. Try to step away for a moment and breathe.",
            "Anger can be energy — channel it into something productive.",
            "Let’s calm down together… inhale… exhale. 🌸"
        ],
        "lonely": [
            "You’re not alone — I’m here with you 🤍",
            "Try connecting with a friend or family member — human connection heals.",
            "Would you like me to suggest some positive self-affirmations?"
        ],
        "tips": [
            "🌱 Self-care tip: Drink water, rest your eyes, and go easy on yourself.",
            "🌻 Remember: You’ve survived 100% of your bad days so far.",
            "🌞 Every sunrise is a new beginning — keep moving forward."
        ],
        "motivation": [
            "💪 You are stronger than you think!",
            "🌸 Progress, not perfection — small steps matter.",
            "🌈 Tough times never last, but tough people do!"
        ]
    }

    while True:
        slow_print("\nHow are you feeling today? (sad / stressed / happy / angry / lonely)")
        slow_print("Or type 'tips', 'motivation', or 'exit' to end the chat.")
        user_input = input("🧘 You: ").lower()

        if user_input == "exit":
            slow_print("\n💚 Remember: Taking care of your mind is self-love.")
            slow_print("See you soon — stay kind to yourself 🌷")
            break

        elif user_input in responses:
            reply = random.choice(responses[user_input])
            slow_print(f"Mind_Care: {reply}")
        else:
            slow_print("Mind_Care: I may not fully understand, but I’m here for you. 💬")

if __name__ == "__main__":
    mind_care_chatbot()
