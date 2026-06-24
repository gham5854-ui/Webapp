import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/shipments_provider.dart';

class ShipmentDetailPage extends StatefulWidget {
  final Map<String, dynamic> shipment;

  const ShipmentDetailPage({super.key, required this.shipment});

  @override
  State<ShipmentDetailPage> createState() => _ShipmentDetailPageState();
}

class _ShipmentDetailPageState extends State<ShipmentDetailPage> {
  late String _currentStatus;

  final List<String> _allStatuses = [
    'Processing',
    'Packed',
    'Picked Up',
    'In Transit',
    'Customs',
    'Out For Delivery',
    'Delivered',
    'Delayed'
  ];

  @override
  void initState() {
    super.initState();
    _currentStatus = widget.shipment['status'] ?? 'Processing';
  }

  List<Map<String, dynamic>> _getTimelineSteps(String status, String courier) {
    const statusOrder = ['Processing', 'Packed', 'Picked Up', 'In Transit', 'Customs', 'Out For Delivery', 'Delivered'];
    final currentIndex = statusOrder.indexOf(status);

    final List<Map<String, dynamic>> steps = [
      {
        'status': 'Processing',
        'desc': 'Payment confirmed. Order is being reviewed by our team.',
        'emoji': '🔄'
      },
      {
        'status': 'Packed',
        'desc': 'Package wrapped and ready to ship via $courier.',
        'emoji': '📦'
      },
      {
        'status': 'Picked Up',
        'desc': '$courier collected the package from sender hub.',
        'emoji': '🏪'
      },
      {
        'status': 'In Transit',
        'desc': 'Package is en route to destination via $courier.',
        'emoji': '✈️'
      },
      {
        'status': 'Customs',
        'desc': 'Customs inspection at international transit checkpoint.',
        'emoji': '🛡️'
      },
      {
        'status': 'Out For Delivery',
        'desc': 'Package is with the last-mile courier for final delivery.',
        'emoji': '🚚'
      },
      {
        'status': 'Delivered',
        'desc': 'Delivered! Surprise verification OTP confirmed by recipient.',
        'emoji': '❤️'
      },
    ];

    return steps.map((step) {
      final stepIndex = statusOrder.indexOf(step['status']);
      bool isDone = false;
      if (status == 'Delivered') {
        isDone = true;
      } else if (currentIndex >= 0) {
        isDone = stepIndex <= currentIndex;
      }

      return {
        ...step,
        'done': isDone,
        'isCurrent': step['status'] == status,
      };
    }).toList();
  }

  void _updateStatus(String? newStatus) async {
    if (newStatus == null || newStatus == _currentStatus) return;

    final provider = Provider.of<ShipmentsProvider>(context, listen: false);
    final success = await provider.updateStatus(widget.shipment['id'], newStatus);

    if (success && mounted) {
      setState(() {
        _currentStatus = newStatus;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Status updated to $newStatus'),
          backgroundColor: Colors.green,
        ),
      );
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Failed to update status'),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final isAdmin = authProvider.user?['role'] == 'admin';

    final courier = widget.shipment['courier'] ?? 'DHL';
    final steps = _getTimelineSteps(_currentStatus, courier);

    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black87,
        title: Text(
          'Shipment Details',
          style: GoogleFonts.outfit(
            textStyle: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Info Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.black12.withOpacity(0.05)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFCE7F3),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'Active Timeline',
                          style: TextStyle(
                            color: Color(0xFFBE185D),
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Text(
                        'ETA: ${widget.shipment['eta'] ?? 'TBD'}',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.black54,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    widget.shipment['item'] ?? 'Surprise Gift',
                    style: GoogleFonts.outfit(
                      textStyle: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w900,
                        color: Colors.black87,
                      ),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'PIN: ${widget.shipment['pin']}',
                    style: const TextStyle(
                      fontSize: 12,
                      fontFamily: 'monospace',
                      color: Colors.black54,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Admin Status Control
            if (isAdmin) ...[
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.black12.withOpacity(0.05)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Admin Actions',
                      style: GoogleFonts.outfit(
                        textStyle: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Update the delivery status of this shipment.',
                      style: TextStyle(fontSize: 11, color: Colors.black38),
                    ),
                    const SizedBox(height: 14),
                    DropdownButtonFormField<String>(
                      value: _allStatuses.contains(_currentStatus) ? _currentStatus : 'Processing',
                      items: _allStatuses.map((status) {
                        return DropdownMenuItem(
                          value: status,
                          child: Text(status),
                        );
                      }).toList(),
                      onChanged: _updateStatus,
                      decoration: InputDecoration(
                        labelText: 'Current Status',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Journey Timeline Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.black12.withOpacity(0.05)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Journey Story Status',
                    style: GoogleFonts.outfit(
                      textStyle: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  
                  // Delayed Warning Banner
                  if (_currentStatus == 'Delayed') ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.red.shade100),
                      ),
                      child: Row(
                        children: [
                          const Text('⚠️', style: TextStyle(fontSize: 18)),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Shipment Delayed',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.red,
                                    fontSize: 12,
                                  ),
                                ),
                                Text(
                                  'This package has been delayed. Our team is resolving the transit issue.',
                                  style: TextStyle(
                                    color: Colors.red.shade400,
                                    fontSize: 10,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],

                  // Custom Timeline Tree
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: steps.length,
                    itemBuilder: (context, index) {
                      final step = steps[index];
                      final isLast = index == steps.length - 1;
                      final isDone = step['done'] as bool;
                      final isCurrent = step['isCurrent'] as bool;

                      return IntrinsicHeight(
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            // Left indicator line & circle
                            Column(
                              children: [
                                Container(
                                  width: 22,
                                  height: 22,
                                  decoration: BoxDecoration(
                                    color: isDone
                                        ? const Color(0xFFEC4899)
                                        : Colors.white,
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: isDone
                                          ? const Color(0xFFEC4899)
                                          : Colors.grey.shade300,
                                      width: 2,
                                    ),
                                    boxShadow: isDone
                                        ? [
                                            BoxShadow(
                                              color: const Color(0xFFEC4899).withOpacity(0.3),
                                              blurRadius: 4,
                                              offset: const Offset(0, 2),
                                            )
                                          ]
                                        : null,
                                  ),
                                  child: isDone
                                      ? const Center(
                                          child: Icon(
                                            Icons.check,
                                            size: 12,
                                            color: Colors.white,
                                          ),
                                        )
                                      : null,
                                ),
                                if (!isLast)
                                  Expanded(
                                    child: Container(
                                      width: 2,
                                      color: isDone
                                          ? const Color(0xFFEC4899)
                                          : Colors.grey.shade200,
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(width: 16),
                            
                            // Step Description Content
                            Expanded(
                              child: Padding(
                                padding: const EdgeInsets.only(bottom: 24.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          '${step['emoji']}  ',
                                          style: const TextStyle(fontSize: 14),
                                        ),
                                        Text(
                                          step['status'],
                                          style: TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.bold,
                                            color: isCurrent
                                                ? const Color(0xFFEC4899)
                                                : isDone
                                                    ? Colors.black87
                                                    : Colors.black38,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      step['desc'],
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: isDone
                                            ? Colors.black54
                                            : Colors.black26,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Specs Grid Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.black12.withOpacity(0.05)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Shipment Specifications',
                    style: GoogleFonts.outfit(
                      textStyle: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Spec Grid Items
                  _buildSpecRow('Sender Name', widget.shipment['sender'] ?? 'John Doe'),
                  const Divider(height: 20),
                  _buildSpecRow('Recipient Name', widget.shipment['recipient'] ?? ''),
                  const Divider(height: 20),
                  _buildSpecRow('Origin Location', widget.shipment['origin'] ?? ''),
                  const Divider(height: 20),
                  _buildSpecRow('Destination', widget.shipment['destination'] ?? ''),
                  const Divider(height: 20),
                  _buildSpecRow('Courier Service', courier),
                  const Divider(height: 20),
                  _buildSpecRow('Insurance Coverage', widget.shipment['insured'] == true ? 'Insured (🛡️)' : 'None'),
                  const Divider(height: 20),
                  _buildSpecRow('Declared Value', '\$${widget.shipment['value'] ?? 0}'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSpecRow(String title, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 12, color: Colors.black45),
        ),
        Text(
          value,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black87),
        ),
      ],
    );
  }
}
