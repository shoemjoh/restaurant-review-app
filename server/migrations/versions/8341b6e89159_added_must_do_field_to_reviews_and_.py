"""Added must_do field to reviews and removed rating

Revision ID: 8341b6e89159
Revises: 92e8247dac9a
Create Date: 2024-11-30 16:06:20.501563

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = '8341b6e89159'
down_revision = '92e8247dac9a'
branch_labels = None
depends_on = None


def upgrade():
    # Drop temporary table if it exists
    conn = op.get_bind()
    inspector = inspect(conn)
    if '_alembic_tmp_reviews' in inspector.get_table_names():
        conn.execute(sa.text("DROP TABLE IF EXISTS _alembic_tmp_reviews"))
    
    # Perform the migration
    with op.batch_alter_table('reviews', schema=None) as batch_op:
        batch_op.add_column(sa.Column('must_do', sa.Boolean(), nullable=False, server_default=sa.text('0')))
        batch_op.drop_column('rating')

    # Remove the default value for 'must_do'
    with op.batch_alter_table('reviews', schema=None) as batch_op:
        batch_op.alter_column('must_do', server_default=None)


def downgrade():
    # Perform the downgrade
    with op.batch_alter_table('reviews', schema=None) as batch_op:
        batch_op.add_column(sa.Column('rating', sa.INTEGER(), nullable=False))
        batch_op.drop_column('must_do')
