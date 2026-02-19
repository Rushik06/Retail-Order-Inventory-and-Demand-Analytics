import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequilize.js';

export class PasswordOtp extends Model {
  declare id: string;
  declare user_id: string;
  declare otp_code: string;
  declare expires_at: Date;
  declare is_used: boolean;
}

PasswordOtp.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    otp_code: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'password_otps',
    timestamps: true,
    underscored: true,
  }
);