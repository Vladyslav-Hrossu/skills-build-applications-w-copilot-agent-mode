from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from octofit_tracker.serializers import (
    UserSerializer,
    TeamSerializer,
    ActivitySerializer,
    LeaderboardSerializer,
    WorkoutSerializer,
)


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': request.build_absolute_uri('users/'),
        'teams': request.build_absolute_uri('teams/'),
        'activities': request.build_absolute_uri('activities/'),
        'leaderboard': request.build_absolute_uri('leaderboard/'),
        'workouts': request.build_absolute_uri('workouts/'),
    })


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all().order_by('-score')
    serializer_class = LeaderboardSerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

