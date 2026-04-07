from rest_framework import serializers
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'created_at']

    def get_id(self, obj):
        return str(obj.pk)


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    members = UserSerializer(many=True, read_only=True)
    member_ids = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, write_only=True, source='members'
    )

    class Meta:
        model = Team
        fields = ['id', 'name', 'members', 'member_ids']

    def get_id(self, obj):
        return str(obj.pk)


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source='user'
    )

    class Meta:
        model = Activity
        fields = ['id', 'user', 'user_id', 'activity_type', 'duration', 'date']

    def get_id(self, obj):
        return str(obj.pk)


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source='user'
    )

    class Meta:
        model = Leaderboard
        fields = ['id', 'user', 'user_id', 'score', 'rank']

    def get_id(self, obj):
        return str(obj.pk)


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'exercises']

    def get_id(self, obj):
        return str(obj.pk)

