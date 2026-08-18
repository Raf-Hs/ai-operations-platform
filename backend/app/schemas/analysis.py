from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    question: str = Field(min_length=1)


class AnalysisResponse(BaseModel):
    answer: str
    reasoning_summary: str
    recommended_action: str