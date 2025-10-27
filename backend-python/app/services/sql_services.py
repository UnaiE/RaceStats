from sqlalchemy.orm import Session
from app.models_sql.user import User
from app.models_sql.favorite import Favorite
from app.models_sql.comparison import Comparison
from typing import List, Optional

# ----------------------------
# USERS
# ----------------------------
def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, username: str, email: str, hashed_password: str) -> User:
    new_user = User(username=username, email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_all_users(db: Session) -> List[User]:
    return db.query(User).all()

# ----------------------------
# FAVORITES
# ----------------------------
def get_user_favorites(db: Session, user_id: int) -> List[Favorite]:
    return db.query(Favorite).filter(Favorite.user_id == user_id).all()

def create_favorite(db: Session, user_id: int, entity_type: str, entity_id: str) -> Favorite:
    fav = Favorite(user_id=user_id, entity_type=entity_type, entity_id=entity_id)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav

def delete_favorite(db: Session, favorite_id: int) -> int:
    fav = db.query(Favorite).filter(Favorite.id == favorite_id).first()
    if not fav:
        return 0
    db.delete(fav)
    db.commit()
    return favorite_id

# ----------------------------
# COMPARISONS
# ----------------------------
def get_user_comparisons(db: Session, user_id: int) -> List[Comparison]:
    return db.query(Comparison).filter(Comparison.user_id == user_id).all()

def create_comparison(db: Session, user_id: int, entity_type: str, entity_ids: str) -> Comparison:
    comp = Comparison(user_id=user_id, entity_type=entity_type, entity_ids=entity_ids)
    db.add(comp)
    db.commit()
    db.refresh(comp)
    return comp

def delete_comparison(db: Session, comparison_id: int) -> int:
    comp = db.query(Comparison).filter(Comparison.id == comparison_id).first()
    if not comp:
        return 0
    db.delete(comp)
    db.commit()
    return comparison_id
