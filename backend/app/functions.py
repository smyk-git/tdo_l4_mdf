from hmac import digest

from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from . import models, crud

hasher_instance = PasswordHash.recommended()

def pass_to_hash(password):
    return hasher_instance.hash(password)

def verify_pass(password, hash_pass):
    return hasher_instance.verify(password, hash_pass)

def validate_user(db: Session,username: str,passw: str):
    user = crud.get_user(db,username)
    if not user:
        return False
    if not verify_pass(passw,user.password):
        return False
    return True

