from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Book
from .serializer import BookSerializer  

# GET all books
@api_view(['GET'])
def get_books(request):
    books = Book.objects.all()
    serializedData = BookSerializer(books, many=True).data
    return Response(serializedData)

# POST create a book
@api_view(['POST'])
def create_books(request):
    data = request.data
    serializer = BookSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# PUT update or DELETE a book
@api_view(['PUT', 'DELETE'])
def book_detail(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    elif request.method == 'PUT':
        data = request.data
        serializer = BookSerializer(book, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  # Changed to 200 OK for update
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
