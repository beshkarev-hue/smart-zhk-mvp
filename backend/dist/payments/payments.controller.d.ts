import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(paymentData: Partial<Payment>): Promise<Payment>;
    findAll(): Promise<Payment[]>;
    findByUser(userId: string): Promise<Payment[]>;
    findOne(id: string): Promise<Payment>;
    markAsPaid(id: string): Promise<Payment>;
    update(id: string, paymentData: Partial<Payment>): Promise<Payment>;
    remove(id: string): Promise<void>;
}
