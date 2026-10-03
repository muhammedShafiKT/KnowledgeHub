from services.llm_service import generate_answer


answer = generate_answer(
    "which model iam using"
)

print(answer)