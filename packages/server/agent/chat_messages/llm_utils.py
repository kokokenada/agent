from langchain.llms import OpenAI

llm = OpenAI(temperature=0.9)


def generate_response(message):
    print(f"Generating response... {message}")
    resp = llm(message)
    print(f"Response: {resp}")
    return resp
