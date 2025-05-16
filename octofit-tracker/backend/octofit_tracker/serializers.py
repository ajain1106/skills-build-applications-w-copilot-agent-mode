from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout
from bson.objectid import ObjectId

class ObjectIdField(serializers.Field):
    def __init__(self, *args, model=None, **kwargs):
        self.model = model
        super().__init__(*args, **kwargs)

    def to_representation(self, value):
        # For ForeignKey, value is a model instance; for id, it's ObjectId
        if hasattr(value, 'id'):
            return str(value.id)
        return str(value) if isinstance(value, ObjectId) else value

    def to_internal_value(self, data):
        if self.model is not None:
            # For ForeignKey fields, fetch the instance
            try:
                return self.model.objects.get(id=ObjectId(data))
            except self.model.DoesNotExist:
                raise serializers.ValidationError(f"Invalid {self.model.__name__} ObjectId: {data}")
        return ObjectId(data)

class UserSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    class Meta:
        model = User
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    class Meta:
        model = Team
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    user = ObjectIdField(model=User)
    class Meta:
        model = Activity
        fields = '__all__'

class LeaderboardSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    team = ObjectIdField(model=Team)
    class Meta:
        model = Leaderboard
        fields = '__all__'

class WorkoutSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    user = ObjectIdField(model=User)
    class Meta:
        model = Workout
        fields = '__all__'
