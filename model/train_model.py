import pandas as pd
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

def train_model():
    # Load dataset
    data_path = os.path.join("..", "data", "cyber_threat_dataset.xlsx")
    if not os.path.exists(data_path):
        print(f"Error: Dataset not found at {data_path}")
        return

    print("Loading dataset...")
    df = pd.read_excel(data_path)
    
    X = df['threat_text']
    y = df['attack_type']

    # Vectorization
    print("Vectorizing text...")
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    X_tfidf = vectorizer.fit_transform(X)

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X_tfidf, y, test_size=0.2, random_state=42)

    # Model Training
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluation
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Training Complete. Accuracy: {acc:.2f}")
    print(classification_report(y_test, y_pred))

    # Save Artifacts
    if not os.path.exists("."):
        os.makedirs(".")
        
    print("Saving model artifacts...")
    with open("model.pkl", "wb") as f:
        pickle.dump(model, f)
    
    with open("vectorizer.pkl", "wb") as f:
        pickle.dump(vectorizer, f)
        
    print("Artifacts saved: model.pkl, vectorizer.pkl")

if __name__ == "__main__":
    train_model()
