from typing import Dict, List, TypedDict


class YouTubeScrappingData(TypedDict):
    author: str
    videoId: str
    title: str
    keywords: List[str]
    viewCount: str
    shortDescription: str
    transcript: str


class NutritionInfo(TypedDict):
    Amount: str
    DailyValue: str


class AllRecipeScrappingData(TypedDict):
    title: str
    subTitle: str
    rating: float
    recipeDetails: Dict[str, str]
    ingredients: List[str]
    steps: List[str]
    nutritionFacts: Dict[str, str]
    nutritionInfo: Dict[str, NutritionInfo]
