FROM python:3.9-slim
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/src
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY src/ ./src/
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]