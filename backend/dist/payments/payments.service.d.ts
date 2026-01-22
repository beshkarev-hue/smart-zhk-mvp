import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
export declare class PaymentsService {
    private paymentsRepository;
    constructor(paymentsRepository: Repository<Payment>);
    create(paymentData: Partial<Payment>): Promise<Payment>;
    findAll(): Promise<Payment[]>;
    findByUser(userId: string): Promise<Payment[]>;
    findOne(id: string): Promise<Payment>;
    markAsPaid(id: string): Promise<Payment>;
    update(id: string, paymentData: Partial<Payment>): Promise<Payment>;
    remove(id: string): Promise<void>;
}
